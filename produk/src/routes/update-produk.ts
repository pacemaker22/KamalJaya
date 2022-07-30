import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser,
  BadRequestError,
} from "@kjbuku/common";

import { Produk } from "../models/produk";
import { ProdukUpdatedPublisher } from "../events/publishers/ProdukUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.patch(
  "/api/produk/:id",
  requireAuth,
  adminUser,
  [param("id").isMongoId().withMessage("Invalid MongoDB ObjectId")],
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
        diPesan,
    } = req.body;

    const produk = await Produk.findById(req.params.id);

    if (!produk) {
      throw new NotFoundError();
    }

    if (produk.diPesan) {
      // throw new BadRequestError("Cannot edit a reserved product");
      produk.diPesan = diPesan;
      throw new BadRequestError('Barang tidak dapat di edit ketika ada order');
    }

    produk.nama = nama ?? produk.nama;
    produk.harga = harga ?? produk.harga;
    produk.gambarItem.gambar1 = gambar1 ?? produk.gambarItem.gambar1;
    produk.gambarItem.gambar2 = gambar2 ?? produk.gambarItem.gambar2;
    produk.warna = warna ?? produk.warna;
    produk.ukuranItem = ukuranItem ?? produk.ukuranItem;
    produk.kategori = kategori ?? produk.kategori;
    produk.deskripsi = deskripsi ?? produk.deskripsi;
    produk.jumlahStock = jumlahStock ?? produk.jumlahStock;

    await produk.save();

    new ProdukUpdatedPublisher(natsWrapper.client).publish({
      id: produk.id,
      nama: nama,
      harga: harga,
      userId: produk.userId,
      gambar: produk.gambarItem.gambar1,
      warna: warna,
      ukuran: ukuranItem,
      kategori: kategori,
      deskripsi: deskripsi,
      jumlahStock: jumlahStock,
      diPesan: produk.diPesan,
      version: produk.version,
    });

    res.send(produk);
  }
);

export { router as updateProdukRouter };
