import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProdukUpdatedEvent,
  NotFoundError,
  QueueGroupNames,
} from "@kjbuku/common";

import { Produk } from "../../models/produk";

export class ProdukUpdatedListener extends Listener<ProdukUpdatedEvent> {
  subject: Subjects.ProdukUpdated = Subjects.ProdukUpdated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ProdukUpdatedEvent["data"], msg: Message) {
    const {
      id,
      nama,
      harga,
      gambar,
      warna,
      jumlahStok,
      kategori,
      deskripsi,
      diPesan,
    } = data;

    const produk = await Produk.findByEvent(data);

    if (!produk) {
      throw new NotFoundError();
    }

    produk.set({
      id,
      nama,
      harga,
      gambar,
      warna,
      jumlahStok,
      kategori,
      deskripsi,
      diPesan,
    });

    // Save and update version
    await produk.save();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
