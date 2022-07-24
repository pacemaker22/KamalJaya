import request from "supertest";
import { app } from "../../app";

it("gagal ketika email tidak diisi", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);
});

it("gagal ketika password yang diinput salah", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pass",
      nama: "artik nurochman",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passwordnyasalah",
    })
    .expect(400);
});

it("respon ketika cookie mendapatkan respon yang benar", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      nama: "artik nurochman",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

});
