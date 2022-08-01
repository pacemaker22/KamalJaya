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
    // Cek order status
    if (data.status !== "dibatalkan") {
      // mengirim message atau ack message
      return msg.ack();
    }

    const items = data.cart;

    if (!items) {
      throw new Error("Keranjang Tidak Ditemukan");
    }

    for (let i = 0; i < items.length; i++) {
      // mencari produk yang dipesan
      const produk = await Produk.findById(items[i].produkId);

      // jika produk tidak ada akan error
      if (!produk) {
        throw new Error("produk tidak ditemukan");
      }

      // menambahkan kuantitas produk didalam stock pada saat order dibatalkan
      const jumlahStok = produk.jumlahStok + items[i].kuantitas;

      // If produk already reserved
      if (produk.jumlahStok === 0 && produk.diPesan === true) {
        //  menandai produk dan set diPesan
        // mengembalikan kuantitas produk di jumlah stock seperti semula(false)
        produk.set({
          jumlahStok: jumlahStok,
          diPesan: false,
        });

        //menyimpan produk
        await produk.save();
      }

      //jika produk masih memiliki stock yang tersisa (maka is diPesan adalah false)
      else {
        produk.set({ jumlahStok: jumlahStok });

        //menyimpan produk
        await produk.save();
      }

      await new ProdukUpdatedPublisher(this.client).publish({
        id: produk.id,
        harga: produk.harga,
        nama: produk.nama,
        userId: produk.userId,
        gambar: produk.gambarItem.gambar1,
        warna: produk.warna,
        kategori: produk.kategori,
        deskripsi: produk.deskripsi,
        jumlahStok: produk.jumlahStok,
        diPesan: produk.diPesan,
        version: produk.version,
      });
    }

    // ack the message
    msg.ack();
  }
}
