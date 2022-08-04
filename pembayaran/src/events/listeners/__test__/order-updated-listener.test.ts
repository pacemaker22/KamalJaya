import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, OrderUpdatedEvent } from "@kjbuku/common";

import { OrderUpdatedListener } from "../OrderUpdatedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Order } from "../../../models/order";
import { Produk } from "../../../models/produk";

const setup = async () => {
  const listener = new OrderUpdatedListener(natsWrapper.client);

  // Create and save a product
  const produk = Produk.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    nama: " Celana SD",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    kategori: "Seragam SD",
    deskripsi: "Seragam untuk anak SD",
    gambar: "asdasdad",
    warna: "Merah",
    jumlahStok: 1,
    diPesan: false,
  });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Dibuat,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    metodePembayaran: "stripe",
    hargaItem,
    ongkir: 0,
    hargaTotal: hargaItem
  });
  await order.save();
  
  

  const data: OrderUpdatedEvent["data"] = {
    id: order.id,
    status: OrderStatus.Dibatalkan,
    userId: order.userId,
    expiresAt: new Date(),
    version: 1,
    metodePembayaran: order.metodePembayaran,
    hargaItem: order.hargaItem,
    ongkir: order.ongkir,
    hargaTotal: order.hargaTotal,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("melakukan update terhadap status order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Dibatalkan);
});

it("acks message ke event", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
