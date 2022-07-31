import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { Produk, ProdukDoc } from "../../models/produk";

const buildProduk = async () => {
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

it("fetching order yang dilakukan oleh user", async () => {
  // membuat produk
  const produk = await buildProduk();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  //melakukan request untuk membuat order dengan produk yang diminta
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  //melakukan request untuk fetching data order yang telah dilakukan oleh user sendiri
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("fetching order yang dilakukan oleh admin", async () => {
  // membuat produk
  const produk = await buildProduk();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);
  const admin = global.adminSignin();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  // melakukan request untuk membuat order dengan produk yang diminta
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  // melakukan request untuk fetching data order yang telah dilakukan oleh admin
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", admin)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // membuat produk
  const produk = await buildProduk();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);
  const anotherUser = global.signin();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  // melakukan request untuk membuat order dengan produk yang diminta
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  // melakukan request untuk fetching data order yang telah dilakukan oleh oleh user yang lain
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .send()
    .expect(401);
});
