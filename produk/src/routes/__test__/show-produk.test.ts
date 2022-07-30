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
            ukuran: "xl",
            gambar1: " ",
            warna: "Merah",
            kategori: "Alat tulis",
            deskripsi:
              "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
            jumlahStock: 12,
    
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


