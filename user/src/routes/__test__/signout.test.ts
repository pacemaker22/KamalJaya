import request from "supertest";
import { app } from "../../app";

it("membersihkan cookie ketika keluar", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      nama: "artik nurochman",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

});
