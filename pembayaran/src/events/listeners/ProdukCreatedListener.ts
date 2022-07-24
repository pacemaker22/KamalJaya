import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProdukCreatedEvent,
  QueueGroupNames,
} from "@kjbuku/common";

import { Produk } from "../../models/produk";

export class ProdukCreatedListener extends Listener<ProdukCreatedEvent> {
  subject: Subjects.ProdukCreated = Subjects.ProdukCreated;
  queueGroupName = QueueGroupNames.PEMBAYARAN_SERVICE;

  async onMessage(data: ProdukCreatedEvent["data"], msg: Message) {
    const {
      id,
      nama,
      harga,
      userId,
      gambar,
      ukuran,
      warna,
      jumlahStock,
      kategori,
      deskripsi,
      diPesan,
    } = data;

    const produk = Produk.build({
      id,
      nama,
      harga,
      userId,
      gambar,
      ukuran,
      warna,
      jumlahStock,
      kategori,
      deskripsi,
      diPesan,
    });
    await produk.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
