import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ProdukDeletedEvent,
  NotFoundError,
  QueueGroupNames,
} from "@kjbuku/common";

import { Produk } from "../../models/produk";

export class ProdukDeletedListener extends Listener<ProdukDeletedEvent> {
  subject: Subjects.ProdukDeleted = Subjects.ProdukDeleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ProdukDeletedEvent["data"], msg: Message) {
    const produk = await Produk.findByEvent(data);

    if (!produk) {
      throw new NotFoundError();
    }

    await produk.remove();

    // Acknowledge the message and tell NATS server it successfully processed
    msg.ack();
  }
}
