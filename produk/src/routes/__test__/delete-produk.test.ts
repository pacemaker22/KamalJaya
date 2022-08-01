import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Produk } from "../../models/produk";
import { natsWrapper } from "../../NatsWrapper";

const createProduk = async () => {
  const adminId = new mongoose.Types.ObjectId().toHexString();

  const { body: produk } = await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin(adminId))
    .send({
      nama: "pulpen",
      harga: 3000,
      userId: "6214a0227e0d2db80ddb0860",
      gambar1: " ",
      warna: "Merah",
      kategori: "Alat tulis",
      deskripsi: "seragam anak sd beragam ukuran",
      jumlahStok: 12,
    });
  return produk;
};

it("Error 401 jika user melakukan request tanpa login", async () => {
  // Create a product
  await createProduk();

  const anotherProdukId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app)
    .delete(`/api/produk/${anotherProdukId}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(401);
});

it("Error 404 jika data produk tidak ditemukan", async () => {
  // Create a product
  await createProduk();

  const anotherProdukId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app)
    .delete(`/api/produk/${anotherProdukId}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(404);
});

it("Kode 200 jika request berhasil", async () => {
  // Create a product
  const produk = await createProduk();

  // Make a delete request
  await request(app)
    .delete(`/api/produk/${produk.id}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(200);

  // Find the deleted product
  const deletedProduk = await Produk.findById(produk.id);

  expect(deletedProduk).toEqual(null);
});

it("publish event", async () => {
  // Create a product
  const produk = await createProduk();

  // Make a delete request
  await request(app)
    .delete(`/api/produk/${produk.id}`)
    .set("Cookie", global.adminSignin())
    .send({})
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
