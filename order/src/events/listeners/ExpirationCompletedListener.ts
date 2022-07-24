import {
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  QueueGroupNames,
  Subjects,
} from "@kjbuku/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { OrderUpdatedPublisher } from "../publishers/OrderUpdatedPublisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Selesai) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Dibatalkan,
    });

    await order.save();

    await new OrderUpdatedPublisher(this.client).publish({
      id: order.id,
      status: OrderStatus.Dibatalkan,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: order.cart,
      metodePembayaran: order.metodePembayaran,
      hargaItem: order.hargaItem,
      ongkir: order.ongkir,
      hargaTotal: order.hargaTotal,
      isBayar: order.isBayar,
      tanggalBayar: order.tanggalBayar,
      tanggalKirim: order.tanggalKirim,
      tanggalSampai: order.tanggalSampai,
    });

    msg.ack();
  }
}
