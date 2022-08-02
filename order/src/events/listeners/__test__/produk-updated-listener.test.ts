import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ProdukUpdatedEvent } from "@kjbuku/common";
import { ProdukUpdatedListener } from "../ProdukUpdatedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Produk } from "../../../models/produk";

const setup = async () => {
  // inisiasi listener
  const listener = new ProdukUpdatedListener(natsWrapper.client);

  // membuat dan menyimpan produk
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

  // Create a fake data object
  const data: ProdukUpdatedEvent["data"] = {
    id: produk.id,
    version: produk.version + 1,
    nama: " Celana SMA",
    harga: 40000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    kategori: "Seragam SMA",
    deskripsi: "Seragam untuk anak SMA",
    gambar: "asdasdad",
    warna: "Abu-abu",
    jumlahStok: 1,
    diPesan: true,
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, produk, listener };
};

it("mencari,mengubah dan menyimpan informasi tentang produk", async () => {
  const { msg, data, produk, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduk = await Produk.findById(produk.id);

  expect(updatedProduk!.nama).toEqual(data.nama);
  expect(updatedProduk!.harga).toEqual(data.harga);
  expect(updatedProduk!.diPesan).toEqual(data.diPesan);
  expect(updatedProduk!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, produk } = await setup();

  data.version = data.version + 1;

  expect(listener.onMessage(data, msg)).rejects.toThrow();

  expect(msg.ack).not.toHaveBeenCalled();
});
