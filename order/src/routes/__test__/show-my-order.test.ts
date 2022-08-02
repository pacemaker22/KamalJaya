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
    jumlahStok: 1,
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
      deskripsi: produk.deskripsi,
      gambar: produk.gambar,
      harga: produk.harga,
      jumlahStok: produk.jumlahStok,
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

it("fetching semua order yang dilakukan oleh admin", async () => {
  // melakuan pembuatan 3 produk
  const produk1 = await buildProduk();
  const produk2 = await buildProduk();
  const produk3 = await buildProduk();

  const user1Id = new mongoose.Types.ObjectId().toHexString();
  const user2Id = new mongoose.Types.ObjectId().toHexString();

  const user1 = global.signin(user1Id);
  const user2 = global.signin(user2Id);

  const {
    jsonCartItems: jsonCartItemsUser1,
    jsonAlamatKirim: jsonAlamatKirimUser1,
    jsonMetodePembayaran: jsonMetodePembayaranUser1,
  } = buildJSON(produk1, user1Id);

  const {
    jsonCartItems: jsonCartItemsUser2OrderOne,
    jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
    jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
  } = buildJSON(produk2, user2Id);

  const {
    jsonCartItems: jsonCartItemsuser2OrderTwo,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
  } = buildJSON(produk3, user2Id);

  // melakukan order untuk user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      jsonCartItems: jsonCartItemsUser1,
      jsonAlamatKirim: jsonAlamatKirimUser1,
      jsonMetodePembayaran: jsonMetodePembayaranUser1,
    })
    .expect(201);

  // melakukan order untuk user 2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsUser2OrderOne,
      jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
      jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
    jsonCartItems: jsonCartItemsuser2OrderTwo,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
    })
    .expect(201);

  //melakukan request untuk fecthing data order oleh admin
  const response = await request(app)
    .get("/api/orders/myorders")
    .set("Cookie", global.adminSignin())
    .expect(200);
    

  expect(response.body.length).toEqual(0);
});

it("fetches semua order yang telah dilakukan oleh user itu sendiri", async () => {
  // membuat 3 produk
  const produk1 = await buildProduk();
  const produk2 = await buildProduk();
  const produk3 = await buildProduk();

  const user1Id = new mongoose.Types.ObjectId().toHexString();
  const user2Id = new mongoose.Types.ObjectId().toHexString();

  const user1 = global.signin(user1Id);
  const user2 = global.signin(user2Id);

  const {
    jsonCartItems: jsonCartItemsUser1,
    jsonAlamatKirim: jsonAlamatKirimUser1,
    jsonMetodePembayaran: jsonMetodePembayaranUser1,
  } = buildJSON(produk1, user1Id);

  const {
    jsonCartItems: jsonCartItemsUser2OrderOne,
    jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
    jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
  } = buildJSON(produk2, user2Id);

  const {
    jsonCartItems: jsonCartItemsUser2OrderTwo,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
  } = buildJSON(produk3, user2Id);

  // membuat order dengan user 1
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      jsonCartItems: jsonCartItemsUser1,
      jsonAlamatKirim: jsonAlamatKirimUser1,
      jsonMetodePembayaran: jsonMetodePembayaranUser1,
    })
    .expect(201);

  // membuat 2 order sebagai user 2
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsUser2OrderOne,
      jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
      jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
    })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsUser2OrderTwo,
      jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
      jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
    })
    .expect(201);

  //melakuan request unutk fetching order untuk user 2
  const response = await request(app)
    .get(`/api/orders/myorders`)
    .set("Cookie", user2)
    .expect(200);

  //memastikan user 2 hanya mendapatkan informasi terkait ordernya sendiri
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].cart[0].produkId).toEqual(produk2.id);
  expect(response.body[1].cart[0].produkId).toEqual(produk3.id);
});

it("fetching semua order untuk beberapa user dan semua user", async () => {
  //buat 3 produk
  const produk1 = await buildProduk();
  const produk2 = await buildProduk();
  const produk3 = await buildProduk();

  const user1Id = new mongoose.Types.ObjectId().toHexString();
  const user2Id = new mongoose.Types.ObjectId().toHexString();

  const user1 = global.signin(user1Id);
  const user2 = global.signin(user2Id);

  const {
    jsonCartItems: jsonCartItemsUser1,
    jsonAlamatKirim: jsonAlamatKirimUser1,
    jsonMetodePembayaran: jsonMetodePembayaranUser1,
  } = buildJSON(produk1, user1Id);

  const {
    jsonCartItems: jsonCartItemsUser2OrderOne,
    jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
    jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
  } = buildJSON(produk2, user2Id);

  const {
    jsonCartItems: jsonCartItemsuser2OrderTwo,
    jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
    jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
  } = buildJSON(produk3, user2Id);

  // membuat 1 order untuk user 1
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      jsonCartItems: jsonCartItemsUser1,
      jsonAlamatKirim: jsonAlamatKirimUser1,
      jsonMetodePembayaran: jsonMetodePembayaranUser1,
    })
    .expect(201);

  // membuat 2 order untuk user kedua
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsUser2OrderOne,
      jsonAlamatKirim: jsonAlamatKirimUser2OrderOne,
      jsonMetodePembayaran: jsonMetodePembayaranUser2OrderOne,
    })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      jsonCartItems: jsonCartItemsuser2OrderTwo,
      jsonAlamatKirim: jsonAlamatKirimuser2OrderTwo,
      jsonMetodePembayaran: jsonMetodePembayaranuser2OrderTwo,
    })
    .expect(201);

  // melakukan request untuk mendapatkan order sebagai user 1
  const response = await request(app)
    .get(`/api/orders/myorders`)
    .set("Cookie", user1)
    .expect(200);

  //memastikan user 1 hanya mendapatkan informasi order yang telah dilakukannya
  expect(response.body.length).toEqual(1);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].cart[0].produkId).toEqual(produk1.id);
});
