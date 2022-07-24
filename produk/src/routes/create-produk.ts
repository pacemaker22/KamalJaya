import express, { Request, Response } from "express";
import { body } from "express-validator";
import { adminUser, requireAuth, validateRequest } from "@kjbuku/common";
import { Produk } from '../models/produk'
import { ProdukCreatedPublisher } from "../events/publishers/ProdukCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.post(
  "/api/produk",
  requireAuth,
  adminUser,
  [
    body("nama").not().isEmpty().withMessage("Nama is required"),
    body("harga")
      .isFloat({ gt: 0 })
      .withMessage("Harga harus lebih besar dari 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      nama,
      harga,
      gambar1,
      gambar2,
      warna,
      ukuranItem,
      kategori,
      deskripsi,
      jumlahStock,
    } = req.body;

    const produk = Produk.build({
      nama,
      harga,
      userId: req.currentUser!.id,
      gambarItem: {
        gambar1,
        gambar2,
      },
      warna,
      ukuranItem,
      kategori,
      deskripsi,
      jumlahStock,
      diPesan: false,
    });

    await produk.save();
    await new ProdukCreatedPublisher(natsWrapper.client).publish({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      userId: produk.userId,
      gambar: produk.gambarItem.gambar1,
      warna: produk.warna,
      ukuran: produk.ukuranItem,
      kategori: produk.kategori,
      deskripsi: produk.deskripsi,
      jumlahStock: produk.jumlahStock,
      diPesan: false,
      version: produk.version,
    });

    res.status(201).send(produk);
  }
);

export { router as createProdukRouter };
