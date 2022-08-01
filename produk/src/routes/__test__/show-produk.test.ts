import request from "supertest";
import { app } from "../../app";

const createProduk = () => {
    return request(app)
        .post("/api/produk")
        .set("Cookie", global.adminSignin())
        .send({
            nama: "puplen",
            harga: 3000,
            userId: "6214a0227e0d2db80ddb0860",
            gambar1: " ",
            warna: "Merah",
            kategori: "Alat tulis",
            deskripsi: "seragam anak sd beragam ukuran",
            jumlahStok: 12,
    
        });

    
}

it("fetching semua daftar produk", async () => {
    await createProduk();
    await createProduk();
    await createProduk();
    await createProduk();

    const respon = await request(app).get("/api/produk").send().expect(200);

    expect(respon.body.length).toEqual(3);

})    


