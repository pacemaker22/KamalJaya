import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@kjbuku/common";

import { natsWrapper } from "../../../NatsWrapper";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { Order } from "../../../models/order";
import { Produk } from "../../../models/produk";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

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
    ukuran: "S,M,L",
    jumlahStock: 1,
    diPesan: false,
  });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Dibuat,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    version: 0,
    metodePembayaran: "stripe",
    hargaItem,
    ongkir: 0,
    hargaTotal: hargaItem
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.hargaTotal).toEqual(data.hargaTotal);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
