import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  QueueGroupNames,
} from "@kjbuku/common";
import { Message } from "node-nats-streaming";

import { Produk } from "../../models/produk";
import { ProdukUpdatedPublisher } from "../publishers/ProdukUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PRODUK_SERVICE;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const items = data.cart;

    if (items!.length === 0) {
      // ack the message
      return msg.ack();
    }

    if (!items) {
      throw new Error("Keranjang tidak ditemukan");
    }

    for (let i = 0; i < items.length; i++) {
      // Find the produk that the order is reserving
      const produk = await Produk.findById(items[i].produkId);

      // If no produk, throw error
      if (!produk) {
        throw new Error("produk not found");
      }

      // Decrease the produk quantity in stock
      const jumlahStock = produk.jumlahStock - items[i].kuantitas;

      // If the produk has been sold out of stock
      if (jumlahStock === 0) {
        // Mark the produk as being reserved by setting its isReserved property
        produk.set({
          jumlahStock: jumlahStock,
          diPesan: true,
        });
      } else {
        produk.set({ jumlahStock: jumlahStock });
      }

      // Save the produk
      await produk.save();

      await new ProdukUpdatedPublisher(this.client).publish({
        id: produk.id,
        harga: produk.harga,
        nama: produk.nama,
        userId: produk.userId,
        gambar: produk.gambarItem.gambar1,
        warna: produk.warna,
        kategori: produk.kategori,
        deskripsi: produk.deskripsi,
        jumlahStock: produk.jumlahStock,
        diPesan: produk.diPesan,
        version: produk.version,
      });
    }

    // ack the message
    msg.ack();
  }
}
