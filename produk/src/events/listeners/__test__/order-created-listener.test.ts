import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@kjbuku/common";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { Produk } from "../../../models/produk";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a product
  const produk = Produk.build({
    nama: "Pulpen Faster",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    gambarItem: {
      gambar1: " ",
    },
    warna: "Merah",
    kategori: "Alat Tulis",
    deskripsi:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    jumlahStock: 3,
    diPesan: false,
  });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Dibuat,
    userId: produk.userId,
    expiresAt: new Date(),
    cart: [
      {
        nama: produk.nama,
        kuantitas: 3,
        warnaItem: "Merah",
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

it("sets diPesan property of the product", async () => {
  const { listener, produk, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const createdProduk = await Produk.findById(produk.id);

  expect(createdProduk!.diPesan).toEqual(true);
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

  const createdProdukData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(createdProdukData.diPesan).toEqual(true);
});
