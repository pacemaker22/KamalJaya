import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Produk, ProdukDoc } from "../../models/produk";
import { Order } from "../../models/order";
import { natsWrapper } from "../../NatsWrapper";
import { OrderStatus } from "@kjbuku/common";

const buildProduk = async () => {
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

  return produk;
};
const buildJSON = (produk: ProdukDoc, userId: string) => {
  const jsonCartItems = JSON.stringify([
    {
      userId: userId,
      nama: produk.nama,
      kuantitas: 1,
      warna: "white",
      size: "M",
      gambar: produk.gambar,
      harga: produk.harga,
      jumlahStock: produk.jumlahStock,
      produkId: produk.id,
    },
  ]);

  const jsonAlamatKirim = JSON.stringify({
    alamat: "cengkareng elok",
    kota: "Jakarta",
    kodePos: "11730",
  });

  const jsonMetodePembayaran = JSON.stringify("stripe");

  return { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran };
};

it("mengembalikan error 401 ketika menandai order menjadi sampai oleh user", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  // Create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  //melakukan request untuk mengubah status order menjadi terkirim/sampai
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.signin(userId))
    .send()
    .expect(401);

  // memastikan order telah terkirim
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.tanggalSampai).toEqual(false);
  expect(updatedOrder!.tanggalKirim).toBeUndefined();
});

it("mengembalikan error 400 saat ingin mengubah tandai belum dibayar menjadi bayar", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  //membuat order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  // melakukan request untuk mengubah status order menjadi BELUM BAYAR/BELUM LUNAS
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(400);

  // memastikan order telah terkirim
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.tanggalSampai).toEqual(false);
  expect(updatedOrder!.tanggalKirim).toBeUndefined();
});

it( "menandai order menjadi dikirim oleh admin", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  // membuat order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  //mengubah status order menjadi selesai (lunas)
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Selesai,
    isPaid: true,
    paidAt: new Date(),
  });
  await newOrder!.save();

  //melakukan request untuk mengubah status order menjadi BAYAR/LUNAS
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(200);

  //memastikan order telah terkirim
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.tanggalSampai).toEqual(true);
  expect(updatedOrder!.tanggalKirim).toBeDefined();
});

it("melakukan update ke event order", async () => {
  const produk = await buildProduk();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = buildJSON(
    produk,
    userId
  );

  // membuat order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonAlamatKirim: jsonAlamatKirim,
      jsonMetodePembayaran: jsonMetodePembayaran,
    })
    .expect(201);

  //mengubah status order menjadi selesai
  const newOrder = await Order.findById(order.id);

  newOrder!.set({
    status: OrderStatus.Selesai,
    isPaid: true,
    paidAt: new Date(),
  });
  await newOrder!.save();

  //melakukan request untuk mengubah status order menjadi dikirim
  await request(app)
    .patch(`/api/orders/${order.id}/deliver`)
    .set("Cookie", global.adminSignin(userId))
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
