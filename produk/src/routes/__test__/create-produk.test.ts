import request from "supertest";
import { app } from "../../app";
import { Produk } from "../../models/produk";
import { natsWrapper } from "../../NatsWrapper";

it("testing route handler terhubung ke /api/produk untuk post produk", async () => {
  const response = await request(app).post("/api/produk").send({});

  expect(response.status).not.toEqual(404);
});

it("Tidak bisa mengakses jika user tidak login", async () => {
  const response = await request(app).post("/api/produk").send({});

  expect(response.status).toEqual(401);
});

it("Tidak bisa mengakses jika user login tapi bukan admin", async () => {
  const response = await request(app)
    .post("/api/produk")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).toEqual(400);
});

it("Mengembalikan status selain 401 jika user yang login adalah admin", async () => {
  const response = await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("Mengembalikan error jika nama produk tidak valid", async () => {
  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama: "",
      harga: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      harga: 10,
    })
    .expect(400);
});

it("Mengembalikan error jika harga tidak diisi atau tidak valid", async () => {
  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama: "good",
      harga: -100,
    })
    .expect(400);

  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama: "good",
    })
    .expect(400);
});

it("Membuat produk dengan inputan yang valid", async () => {
  let produk = await Produk.find({});
  expect(produk.length).toEqual(0);

  const nama = "Seragam SD";

  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama,
      harga: 40000,
      userId: "6214a0227e0d2db80ddb0860",
      gambar1: " ",
      warna: "Merah",
      kategori: "Alat tulis",
      deskripsi: "seragam anak sd beragam ukuran",
      jumlahStock: 12,
    })
    .expect(201);

    produk = await Produk.find({});
  expect(produk.length).toEqual(1);
  expect(produk[0].harga).toEqual(40000);
  expect(produk[0].nama).toEqual(nama);
});

it("Publish event", async () => {
  await request(app)
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
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
