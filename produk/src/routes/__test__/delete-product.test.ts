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
      nama: "Sample Dress",
      harga: 99,
      userId: adminId,
      ukuran: "xl",
      gambar1: "./asset/sample.jpg",
      warna: "White,Black",
      kategori: "Dress",
      deskripsi:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      jumlahStock: 12,
    });
  return produk;
};

it("return 401 when make a request by user without authorized", async () => {
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

it("return 404 when the product data is not found", async () => {
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

it("return 200 when make a successful request", async () => {
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

it("publishes an event", async () => {
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
