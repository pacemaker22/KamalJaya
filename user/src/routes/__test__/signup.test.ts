import request from "supertest";
import { app } from "../../app";

it("kode 201 ketika berhasil signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      id: '12134213123',
      email: 'test@test.com',
      isAdmin: true,
      password: 'admin',
      nama: 'admin',
      foto: ' ',
      alamatKirim: {
          alamat: 'jalan panjang lika liku',
          kota: 'jakarta',
          kodePos: '11730',
      }
    })
    .expect(201);
});

it("kode 400 ketika email salah", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bukanemail",
      password: "password",
      nama: "gondes",
      alamatKirim: {
        alamat: "Jalan jalan",
        kota: "Segitiga",
        kodePos: "9999",
      },
    })
    .expect(400);
});

it("kode 400 ketika password salah", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
      nama: "gondes",
      alamatKirim: {
        alamat: "Jalan jalan",
        kota: "Segitiga",
        kodePos: "9999",
      },
    })
    .expect(400);
});

it("kode 400 ketika email dan password kosong", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("email tidak boleh sama", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      nama: "gondes",
      alamatKirim: {
        alamat: "Jalan jalan",
        kota: "Segitiga",
        kodePos: "9999",
      },
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      nama: "gondes",
      alamatKirim: {
        alamat: "Jalan jalan",
        kota: "Segitiga",
        kodePos: "9999",
      },
    })
    .expect(400);
});

it("mengisi cookie ketika berhasil signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      nama: "gondes",
      alamatKirim: {
        alamat: "Jalan jalan",
        kota: "Segitiga",
        kodePos: "9999",
      },
    })
    .expect(201);
});
