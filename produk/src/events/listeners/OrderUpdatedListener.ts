import {
  Listener,
  OrderUpdatedEvent,
  Subjects,
  QueueGroupNames,
} from "@kjbuku/common";
import { Message } from "node-nats-streaming";

import { Produk } from "../../models/produk";
import { ProdukUpdatedPublisher } from "../publishers/ProdukUpdatedPublisher";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = QueueGroupNames.PRODUK_SERVICE;

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    // Check order status
    if (data.status !== "dibatalkan") {
      // Do nothing, just ack the message
      return msg.ack();
    }

    const items = data.cart;

    if (!items) {
      throw new Error("Keranjang Tidak Ditemukan");
    }

    for (let i = 0; i < items.length; i++) {
      // Find the produk that the order is reserving
      const produk = await Produk.findById(items[i].produkId);

      // If no produk, throw error
      if (!produk) {
        throw new Error("produk tidak ditemukan");
      }

      // Increase the produk quantity in stock by return quantity from the cancelled order
      const jumlahStock = produk.jumlahStock + items[i].kuantitas;

      // If produk already reserved
      if (produk.jumlahStock === 0 && produk.diPesan === true) {
        // Mark the produk as avaliable by setting its isReserved property
        // and return quantity in stock to previous state
        produk.set({
          jumlahStock: jumlahStock,
          diPesan: false,
        });

        // Save the produk
        await produk.save();
      }

      // If the produk still have some stock left (isReserved is still false)
      else {
        produk.set({ jumlahStock: jumlahStock });

        // Save the produk
        await produk.save();
      }

      await new ProdukUpdatedPublisher(this.client).publish({
        id: produk.id,
        harga: produk.harga,
        nama: produk.nama,
        userId: produk.userId,
        gambar: produk.gambarItem.gambar1,
        warna: produk.warna,
        ukuran: produk.ukuranItem,
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
