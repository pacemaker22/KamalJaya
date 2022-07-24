import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

const createUser = async (email?: string) => {
  const { body: user } = await request(app)
    .post("/api/users/signup")
    .send({
      email: email || "test@test.com",
      password: "password",
      isAdmin: true,
      nama: "artik nurochman",
      foto: " ",
      alamatKirim: {
        alamat: "Jalan bangun nusa",
        kota: "jakarta",
        kodePos: "9999",
      },
    });

  return user;
};

it("Kode 400 dengan email yang salah", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "gg",
      nama: "artik nurochman",
      password: "artiknurochman",
    })
    .expect(400);
});

it("Kode 400 dengan password yang salah", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test@test.com",
      nama: "artik nurochman",
      password: "3132132131313",
    })
    .expect(400);
});

it("Kode 200 ketika user melakukan request untuk edit profile", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: user.email,
      isAdmin: user.isAdmin,
      nama: "artik nurochman",
      foto: "https://joeschmoe.io/api/v1/male/geralt",
      jsonAlamatKirim: user.alamatKirim,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.nama).toEqual("artik nurochman");
  expect(updatedUser!.foto).toEqual("https://joeschmoe.io/api/v1/male/geralt");
});

it("Kode 400 ketika user request untuk melakukan pergantian email dengan password yang salah", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "wrongPassword",
      isAdmin: user.isAdmin,
      nama: user.nama,
      foto: user.foto,
      jsonAlamatKirim: user.alamatKirim,
    })
    .expect(400);
});

it("Kode 200 ketika request untuk mengganti email", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "password",
      isAdmin: user.isAdmin,
      nama: user.nama,
      foto: user.foto,
      jsonAlamatKirim: user.alamatKirim,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.email).toEqual("test2@test.com");
});

it("Kode 200 ketika melakukan request mengganti password", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "password",
      newPassword: "passwordbaru",
      isAdmin: user.isAdmin,
      nama: user.nama,
      foto: user.foto,
      jsonAlamatKirim: user.alamatKirim,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.password).not.toEqual(user.password);
});

it("Kode 200 ketika request untuk mengganti alamat", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: user.email,
      isAdmin: user.isAdmin,
      nama: user.nama,
      foto: user.foto,
      jsonAlamatKirim: JSON.stringify({
        alamat: "dibawah pohon beringin",
        kota: "Jogja",
        kodePos: "11730",
      }),
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.alamatKirim?.alamat).toEqual("dibawah pohon beringin");
  expect(updatedUser!.alamatKirim?.kota).toEqual("Jogja");
  expect(updatedUser!.alamatKirim?.kodePos).toEqual("11730");
});
