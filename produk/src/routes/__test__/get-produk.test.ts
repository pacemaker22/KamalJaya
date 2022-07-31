import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("Error 404 jika produk tidak ditemukan", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
  
    await request(app).get(`/api/products/${id}`).send().expect(404);
  });

it("mengembalikan produk jika produk tidak ditemukan", async () => {
    const harga = 30000;
    const nama = "Papan tulis";

    const response = await request(app)
    .post('/api/produk')
    .set("Cookie", global.adminSignin())
    .send({
      nama,
      harga,
      userId: "6214a0227e0d2db80ddb0860",
      ukuran: "xl",
      gambar1: " ",
      warna: "Merah",
      kategori: "Alat tulis",
      deskripsi: "seragam anak sd beragam ukuran",
      jumlahStock: 12,
    })
    .expect(201);

    const responProduk = await request(app)
        .get(`api/produk/${response.body.id}`)
        .send()
        .expect(200);

    expect(responProduk.body.nama).toEqual(nama);
    expect(responProduk.body.harga).toEqual(harga);

})