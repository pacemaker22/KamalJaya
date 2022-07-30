import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderUpdatedEvent, OrderStatus } from "@kjbuku/common";
import { OrderUpdatedListener } from "../OrderUpdatedListener";
import { Produk } from "../../../models/produk";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // menginisiasi listener dan isinya
  const listener = new OrderUpdatedListener(natsWrapper.client);

  //membuat dan meyimpan produk
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
      diPesan: true,
    });

  produk.set({ diPesan: true });
  await produk.save();

  const hargaItem = parseFloat(produk.harga.toFixed(2));

  // membuat data palsu untuk testing event
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
        ukuran: "XL",
        warna: "merah",
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

it("melakukan update terhadap status dari order", async () => {
  const { listener, produk, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduk = await Produk.findById(produk.id);

  expect(updatedProduk?.diPesan).toEqual(false);
  expect(updatedProduk?.jumlahStock).toEqual(2);
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
});
