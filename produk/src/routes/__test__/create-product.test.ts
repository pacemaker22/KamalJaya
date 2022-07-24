import request from "supertest";
import { app } from "../../app";
import { Produk } from "../../models/produk";
import { natsWrapper } from "../../NatsWrapper";

it("has a route handler listening to /api/products for post requests", async () => {
  const response = await request(app).post("/api/produk").send({});

  expect(response.status).not.toEqual(404);
});

it("can NOT access if the user is NOT signing in", async () => {
  const response = await request(app).post("/api/produk").send({});

  expect(response.status).toEqual(401);
});

it("can NOT access if the user who signed in is NOT an admin", async () => {
  const response = await request(app)
    .post("/api/produk")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid nama is provided", async () => {
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

it("returns an error if an invalid harga is provided", async () => {
  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama: "good",
      harga: -10,
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

it("creates a product with valid inputs", async () => {
  let produk = await Produk.find({});
  expect(produk.length).toEqual(0);

  const nama = "Sample Dress";

  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      nama,
      harga: 40000,
      userId: "6214a0227e0d2db80ddb0860",
      ukuran: "xl",
      gambar1: "./asset/sample.jpg",
      warna: "White,Black",
      kategori: "Dress",
      deskripsi:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      jumlahStock: 12,
    })
    .expect(201);

    produk = await Produk.find({});
  expect(produk.length).toEqual(1);
  expect(produk[0].harga).toEqual(20000);
  expect(produk[0].nama).toEqual(nama);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/produk")
    .set("Cookie", global.adminSignin())
    .send({
      nama: "puplen",
      harga: 3000,
      userId: "6214a0227e0d2db80ddb0860",
      ukuran: "xl",
      gambar1: "./asset/sample.jpg",
      warna: "White,Black",
      kategori: "Dress",
      deskripsi:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      jumlahStock: 12,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
