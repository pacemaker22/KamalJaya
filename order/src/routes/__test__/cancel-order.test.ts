import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Produk, ProdukDoc } from "../../models/produk";
import { Order } from "../../models/order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderStatus } from "@kjbuku/common";

const buildProduk = async () => {
  const produk = Produk.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    nama: " Celana SD",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    kategori: "Seragam SD",
    deskripsi: "Seragam untuk anak SD",
    gambar: " ",
    warna: "Merah",
    ukuran: "S,M,L",
    jumlahStock: 1,
    diPesan: false,
  });
  await produk.save();

  return produk;
};

const buildJSON = (produk: ProdukDoc, userId: string) => {
  const jsonCartItems = JSON.stringify([
    {
      userId: userId,
      nama: produk.nama,
      kuantitas: 1,
      warna: "Merah",
      ukuran: "M",
      deskripsi: produk.deskripsi,
      gambar: produk.gambar,
      harga: produk.harga,
      jumlahStock: produk.jumlahStock,
      produkId: produk.id,
    },
  ]);

  const jsonAlamatKirim = JSON.stringify({
    alamat: "cengkareng elok",
    kota: "Jakarta",
    kodePos: "11730",
  });

  const jsonMetodePembayaran = JSON.stringify("stripe");

  return { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran };
};

it("Menandai order menjadi dibatalkan", async () => {
  const userId = global.signin();

  const produk = Produk.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    nama: " Celana SD",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    kategori: "Seragam SD",
    deskripsi: "Seragam untuk anak SD",
    gambar: " ",
    warna: "Merah",
    ukuran: "S,M,L",
    jumlahStock: 1,
    diPesan: false,
  });
  await produk.save();
  const jsonCartItems = JSON.stringify([
    {
      userId: userId,
      nama: produk.nama,
      kuantitas: 1,
      warna: "Merah",
      ukuran: "M",
      deskripsi: produk.deskripsi,
      gambar: produk.gambar,
      harga: produk.harga,
      jumlahStock: produk.jumlahStock,
      produkId: produk.id,
    },
  ]);

  const jsonAlamatKirim = JSON.stringify({
    alamat: "cengkareng elok",
    kota: "Jakarta",
    kodePos: "11730",
  });

  const jsonMetodePembayaran = JSON.stringify("stripe");

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userId)
    .send({
      produkId: produk.id,
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  // membuat request untuk membatalkan order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", userId)
    .send()
    .expect(200);

  // untuk memastikan bahwa order telah dibatalkan
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Dibatalkan);
});

it("melakukan update ke event order", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  // melakukan request untuk membatalkan order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
