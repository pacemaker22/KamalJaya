import {
  Subjects,
  Listener,
  PembayaranCreatedEvent,
  OrderStatus,
  QueueGroupNames,
} from "@kjbuku/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderUpdatedPublisher } from "../publishers/OrderUpdatedPublisher";

export class PembayaranCreatedListener extends Listener<PembayaranCreatedEvent> {
  subject: Subjects.PembayaranCreated = Subjects.PembayaranCreated;
  queueGroupName = QueueGroupNames.ORDER_SERVICE;

  async onMessage(data: PembayaranCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Selesai,
      isPaid: true,
      paidAt: new Date(),
    });
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Selesai,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      metodePembayaran: order.metodePembayaran,
      hargaItem: order.hargaItem,
      ongkir: order.ongkir,
      hargaTotal: order.hargaTotal,
      isBayar: true,
      tanggalBayar: new Date(),
      tanggalKirim: order.tanggalKirim,
      tanggalSampai: order.tanggalSampai,
    });

    msg.ack();
  }
}
