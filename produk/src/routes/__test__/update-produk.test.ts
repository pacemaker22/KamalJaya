import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../NatsWrapper";
import { Produk } from "../../models/produk";


const createProduk = async () => {
    const adminId = new mongoose.Types.ObjectId().toHexString();

    const { body: produk } = await request(app)
        .post("/api/produk")
        .set("Cookie", global.adminSignin(adminId))
        .send({
            nama: "puplen",
            harga: 3000,
            userId: "6214a0227e0d2db80ddb0860",
            ukuran: "xl",
            gambar1: " ",
            warna: "Merah",
            kategori: "Alat tulis",
            deskripsi:
              "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
            jumlahStock: 12,
        })
        return produk;
};

it("Error 404 jika id tidak eksis", async () => {
    const anotherProdukId = new mongoose.Types.ObjectId().toHexString();

    await createProduk();

    await request(app)
        .patch(`/api/produk/${anotherProdukId}`)
        .set("Cookie", global.adminSignin())
        .send({
            nama: "Pulpen pilot",
            harga: 1500,
        })
        .expect(404);

});

it("Error 401 jika user tidak login", async () => {
    const produk = await createProduk();

    await request(app)
        .patch(`/api/produk/${produk.id}`)
        .send({
            nama: "Pulpen pilot",
            harga: 1500
        })
        .expect(401);
});

it("update produk dengan inputan yang valid sebagai admin", async () => {
    const cookie = global.adminSignin();

    const produk = await createProduk();

    await request(app)
        .patch(`/api/produk/${produk.id}`)
        .set("Cookie", cookie)
        .send({
            nama: "Pulpen Standard",
            harga: 2000
        })
        .expect(200);
    const { body: responProduk } = await request(app)
        .get(`/api/produk/${produk.id}`)
        .send()

    expect(responProduk.nama).toEqual("Pulpen Standard");
    expect(responProduk.harga).toEqual(2000);
})

it("Publish Event", async () => {
    const cookie = global.adminSignin();

    const produk = await createProduk();

    await request(app)
        .patch(`/api/produk/${produk.id}`)
        .set("Cookie", cookie)
        .send({
            nama: "puplen",
            harga: 3000,
            userId: "6214a0227e0d2db80ddb0860",
            ukuran: "xl",
            gambar1: " ",
            warna: "Merah",
            kategori: "Alat tulis",
            deskripsi:
              "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
            jumlahStock: 12,

        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);

});