import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@kjbuku/common";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { Produk } from "../../../models/produk";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  //membuat dan menginisiasi listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // membuat dan menyimpan produk
  const produk = Produk.build({
    nama: "Pulpen Faster",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    gambarItem: {
      gambar1: " ",
    },
    ukuranItem: "XL",
    warna: "Merah",
    kategori: "Alat Tulis",
    deskripsi: "Pulpen merk faster",
    jumlahStock: 3,
    diPesan: false,
  });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  // Membuat data palsu untuk testing event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Dibuat,
    userId: produk.userId,
    expiresAt: new Date(),
    cart: [
      {
        ukuran: "XL",
        nama: produk.nama,
        kuantitas: 1,
        warna: "Merah",
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

it("melakukan set terhadap property diPesan menjadi true dari produk", async () => {
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

it("publish event tentang produk yang telah diupdate", async () => {
  const { listener, produk, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const createdProdukData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(createdProdukData.diPesan).toEqual(true);
});
