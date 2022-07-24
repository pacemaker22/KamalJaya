import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  QueueGroupNames,
} from "@kjbuku/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PEMBAYARAN_SERVICE;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Build an order
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      metodePembayaran: data.metodePembayaran,
      hargaItem: data.hargaItem,
      ongkir: data.ongkir,
      hargaTotal: data.hargaTotal,
    });

    await order.save();

    // ack the message
    msg.ack();
  }
}
