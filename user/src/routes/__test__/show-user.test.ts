import request from "supertest";
import { app } from "../../app";

it("kode 404 data user kosong", async () => {
  await request(app).get("/api/users").send({}).expect(404);
});

it("kode 200 ketika request terpenuhi", async () => {
  await request(app)
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

  const { body: users } = await request(app)
    .get("/api/users")
    .send({})
    .expect(200);

  expect(users.length).toEqual(1);
  expect(users[0].email).toBeDefined();
});
