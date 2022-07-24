import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderUpdatedEvent, OrderStatus } from "@kjbuku/common";
import { OrderUpdatedListener } from "../OrderUpdatedListener";
import { Produk } from "../../../models/produk";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderUpdatedListener(natsWrapper.client);

  // Create and save a Produk
  const produk = Produk.build({
    nama: "Sample Dress",
    harga: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    gambarItem: {
      gambar1: "./asset/sample.jpg",
    },
    warna: "White,Black",
    kategori: "Dress",
    deskripsi:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    jumlahStock: 3,
    diPesan: true,
  });

  produk.set({ diPesan: true });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  // Create the fake data event
  const data: OrderUpdatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    status: OrderStatus.Dibatalkan,
    userId: produk.userId,
    expiresAt: new Date(),
    cart: [
      {
        nama: produk.nama,
        kuantitas: 2,
        warnaItem: "white",
        gambar: produk.gambarItem.gambar1,
        harga: produk.harga,
        produkId: produk.id,
      },
    ],
    metodePembayaran: "stripe",
    hargaItem: hargaItem,
    ongkir: 0,
    hargaTotal: hargaItem,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, produk, data, msg };
};

it("updates the order to updated status", async () => {
  const { listener, produk, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduk = await Produk.findById(produk.id);

  expect(updatedProduk!.diPesan).toEqual(false);
  expect(updatedProduk!.jumlahStock).toEqual(2);
});

it("acks the message", async () => {
  const { listener, produk, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a product updated event", async () => {
  const { listener, produk, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
