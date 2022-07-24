import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

const createUser = async () => {
  const { body: user } = await request(app)
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
      },
    });
  return user;
};

it("kode 404 ketika data user tidak ditemukan", async () => {
  // Create a user
  const user = await createUser();

  const anotherUserId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app).delete(`/api/users/${anotherUserId}`).send({}).expect(404);
});

it("kode 200 ketika request terpenuhi", async () => {
  // Create a user
  const user = await createUser();

  // Make a delete request
  await request(app).delete(`/api/users/${user.id}`).send({}).expect(200);

  // Find the deleted user

  expect(200)
});
