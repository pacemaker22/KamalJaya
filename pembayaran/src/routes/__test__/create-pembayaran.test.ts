import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@kjbuku/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Produk } from "../../models/produk";
import { stripe } from "../../stripe";
import { Pembayaran } from "../../models/pembayaran";

// jest.mock("../stripe");

const setup = async (userId?: string) => {
  const harga = Math.floor(Math.random() * 100000);

  // Create and save a product
  const produk = Produk.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    nama: " Celana SD",
    harga: 25000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    kategori: "Seragam SD",
    deskripsi: "Seragam untuk anak SD",
    gambar: "asdasdad",
    warna: "Merah",
    ukuran: "S,M,L",
    jumlahStock: 1,
    diPesan: false,
  });
  await produk.save();

  const hargaItem = Math.floor(parseFloat(produk.harga.toFixed(2)));
 

  // Create and save the order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Dibuat,
    userId: userId || new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    metodePembayaran: "stripe",
    hargaItem,
    ongkir: 0,
    hargaTotal: hargaItem
  });
  await order.save();

  return order;
};

it("Error 404 ketika membayar order yang tidak ada/dilakukan", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "randomToken",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Error 401 ketika membayar order yang bukan milik user itu sendiri", async () => {
  // Create and save a product
  const order = await setup();

  await request(app)
    .post("/api/pembayaran")
    .set("Cookie", global.signin())
    .send({
      token: "randomToken",
      orderId: order.id,
    })
    .expect(401);
});

it("Error 400 ketika membayar order yang telah dibatalkan", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  
  // Create and save a product
  const order = await setup(userId);

  await request(app)
    .post("/api/pembayaran")
    .set("Cookie", global.signin(userId))
    .send({
      token: "randomToken",
      orderId: order.id,
    })
    .expect(400);
});

it("Kode 201 ketika memasukan inputan yang valid", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const hargaItem = Math.floor(Math.random() * 100000);
  // membuat produk dan order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Dibuat,
    userId: userId || new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    metodePembayaran: "stripe",
    hargaItem,
    ongkir: 0,
    hargaTotal: hargaItem,
  });
  await order.save();

  await request(app)
    .post("/api/pembayaran")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(order.totalPrice * 100);
  // expect(chargeOptions.currency).toEqual("usd");

  const stripeCharges = await stripe.charges.list({ limit: 50});
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === order.hargaItem
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const pembayaran = await Pembayaran.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(pembayaran).not.toBeNull();
});
