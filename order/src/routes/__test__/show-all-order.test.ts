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
      size: "M",
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

it("fetching semua order oleh admin", async () => {
  // Create three products
  const produk1 = await buildProduk();
  const produk2 = await buildProduk();
  const produk3 = await buildProduk();

  const user1Id = new mongoose.Types.ObjectId().toHexString();
  const user2Id = new mongoose.Types.ObjectId().toHexString();

  const user1 = global.signin(user1Id);
  const user2 = global.signin(user2Id);
  const admin = global.adminSignin();

  const {
    jsonCartItems: jsonCartItemsuser1,
    jsonAlamatKirim: jsonAlamatKirimuser1,
    jsonMetodePembayaran: jsonMetodePembayaranuser1,
  } = buildJSON(produk1, user1Id);

  const {
    jsonCartItems: jsonCartItemsuser2OrderOne,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderOne,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderOne,
  } = buildJSON(produk2, user2Id);

  const {
    jsonCartItems: jsonCartItemsuser2OrderTwo,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
  } = buildJSON(produk3, user2Id);

  // membuat order unutk user 3
  const { body: order1untukuser1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      jsonCartItems: jsonCartItemsuser1,
      jsonAlamatKirim: jsonAlamatKirimuser1,
      jsonMetodePembayaran: jsonMetodePembayaranuser1,
    })
    .expect(201);

  // membuat order untuk user 2
  const { body: order1untukuser2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsuser2OrderOne,
      jsonAlamatKirim: jsonAlamatKirimuser2OrderOne,
      jsonMetodePembayaran: jsonMetodePembayaranuser2OrderOne,
    })
    .expect(201);

  const { body: order2untukuser2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsuser2OrderTwo,
      jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
      jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
    })
    .expect(201);

  //membuat request untuk fetching semua order oleh Admin
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", admin)
    .expect(200);

  //memastikan admin mendapatkan semua informasi order
  expect(response.body.length).toEqual(3);
  expect(response.body[0].id).toEqual(order1untukuser1.id);
  expect(response.body[1].id).toEqual(order1untukuser2.id);
  expect(response.body[2].id).toEqual(order2untukuser2.id);
  expect(response.body[0].cart[0].produkId).toEqual(produk1.id);
  expect(response.body[1].cart[0].produkId).toEqual(produk2.id);
  expect(response.body[2].cart[0].produkId).toEqual(produk3.id);
});
