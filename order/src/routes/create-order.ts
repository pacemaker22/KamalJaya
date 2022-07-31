import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@kjbuku/common";

import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher";
import { Produk } from "../models/produk";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 30 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("jsonCartItems")
      .not()
      .isEmpty()
      .withMessage("Keranjang tidak boleh kosong"),
    body("jsonAlamatKirim")
      .not()
      .isEmpty()
      .withMessage("Alamat pengiriman harus diisi"),
    body("jsonMetodePembayaran")
      .not()
      .isEmpty()
      .withMessage("Metode Pembayaran harus dipilih"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { jsonCartItems, jsonAlamatKirim, jsonMetodePembayaran } = req.body;

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Check if it is JSON type, them convrt to javascript object
    let cartItems; //่JSON
    if (typeof jsonCartItems === "string") {
      cartItems = await JSON.parse(jsonCartItems);
    } else if (typeof jsonCartItems === "object") {
      cartItems = jsonCartItems;
    }

    let alamatKirim; //่JSON
    if (typeof jsonAlamatKirim === "string") {
      alamatKirim = await JSON.parse(jsonAlamatKirim);
    } else if (typeof jsonAlamatKirim === "object") {
      alamatKirim = jsonAlamatKirim;
    }

    let metodePembayaran; //่javascript
    if (typeof jsonMetodePembayaran === "string") {
      metodePembayaran = await JSON.parse(jsonMetodePembayaran);
    } else if (typeof jsonMetodePembayaran === "object") {
      metodePembayaran = jsonMetodePembayaran;
    }

    //mencari produk yang dipesan pada keranjang
    for (let i = 0; i < cartItems.length; i++) {
      const produkDiPesan = await Produk.find({
        _id: cartItems[i].produkId,
        diPesan: true,
      });

      // mencari produk yang ada didalam database
      const databaseProduk = await Produk.findById(cartItems[i].produkId);

      // If reservedProduct existed, throw an error
      if (produkDiPesan && produkDiPesan.length !== 0) {
        throw new Error(`${cartItems[i].nama} Telah diPesan`);
      }

      // jika produk tidak ada di database error not found
      if (!databaseProduk) {
        throw new NotFoundError();
      }
    }

    

    //kalkulasi harga
    const hargaItem = cartItems.reduce(
      //@ts-ignore
      (acc, item) => acc + item.harga * item.kuantitas,
      0
    );
    const ongkir = 0.0;
    let hargaTotal = 0.0;
     
    if (hargaTotal > 100.000){
      ongkir + 0.0;
    }else if (hargaTotal < 50.000) {
      ongkir + 10.000;
    }else {
      ongkir + 15.000;
    }
   hargaTotal = hargaItem + ongkir;
    //build order dan menyimpan ke database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Dibuat,
      expiresAt: expiration,
      cart: cartItems,
      alamatKirim,
      metodePembayaran,
      hargaItem: parseFloat(hargaItem.toFixed(2)),
      ongkir: parseFloat(ongkir.toFixed(2)),
      hargaTotal: parseFloat(hargaTotal.toFixed(2)),
    });

    await order.save();

    //publish event bahwa event order telah dibuat
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: cartItems,
      metodePembayaran: order.metodePembayaran,
      hargaItem: order.hargaItem,
      ongkir: order.ongkir,
      hargaTotal: order.hargaTotal,
      isBayar: order.isBayar,
      isTerkirim: order.isTerkirim,
      tanggalSampai: order.tanggalSampai,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
