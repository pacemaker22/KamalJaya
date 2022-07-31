import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Produk, ProdukDoc } from "../../models/produk";
import { natsWrapper } from "../../NatsWrapper";

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

it("mengembalikan error jika ada produk yang tidak tersedia di cart", async () => {
  // @ts-ignore
  const produk: ProdukDoc = {
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

  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(404);
});

it("mengembalikan error jika produk telah diorder", async () => {
  // hanya 1 produk
  const produk = await buildProduk();

  const user1Id = new mongoose.Types.ObjectId().toHexString();
  const user2Id = new mongoose.Types.ObjectId().toHexString();

  const {
    jsonCartItems: jsonCartItemsUser1,
    jsonAlamatKirim: jsonAlamatKirimUser1,
    jsonMetodePembayaran: jsonMetodePembayaranUser1,
  } = buildJSON(produk, user1Id);

  const {
    jsonCartItems: jsonCartItemsUser2,
    jsonAlamatKirim: jsonAlamatKirimUser2,
    jsonMetodePembayaran: jsonMetodePembayaranUser2,
  } = buildJSON(produk, user2Id);

  // Melakukan order terhadap produk
  const { body: user1Order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(user1Id))
    .send({
      jsonCartItems: jsonCartItemsUser1,
      jsonAlamatKirim: jsonAlamatKirimUser1,
      jsonMetodePembayaran: jsonMetodePembayaranUser1,
    })
    .expect(201);

  const updatedProduk = await Produk.findById(produk.id);
  updatedProduk!.set({
    diPesan: true,
    jumlahStock:
    produk.jumlahStock - JSON.parse(jsonCartItemsUser1)[0].kuantitas,
  });
  await updatedProduk!.save();

  const { body: user2Order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(user2Id))
    .send({
      jsonCartItems: jsonCartItemsUser2,
      jsonAlamatKirim: jsonAlamatKirimUser2,
      jsonMetodePembayaran: jsonMetodePembayaranUser2,
    })
    .expect(400);

  console.log();

  expect(updatedProduk?.diPesan).toEqual(true);
  expect(updatedProduk?.jumlahStock).toEqual(0);
});

it("Memesan Produk", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);
});

it("melakukan update ke event order", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
