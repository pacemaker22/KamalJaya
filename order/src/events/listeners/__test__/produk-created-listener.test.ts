import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ProdukCreatedEvent } from "@kjbuku/common";
import { ProdukCreatedListener } from "../ProdukCreatedListener";
import { Produk } from "../../../models/produk";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // create an instance of the listener
  const listener = new ProdukCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: ProdukCreatedEvent["data"] = {
    version: 0,
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
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("membuat dan menyimpan produk", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a product was created!
  const produk = await Produk.findById(data.id);

  expect(produk).toBeDefined();
  expect(produk!.nama).toEqual(data.nama);
  expect(produk!.kategori).toEqual(data.kategori);
  expect(produk!.jumlahStock).toEqual(data.jumlahStock);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
