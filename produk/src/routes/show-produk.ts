import express, { Request, Response } from "express";
import { Produk } from '../models/produk'

const router = express.Router();

router.get("/api/produk", async (req: Request, res: Response) => {
  const produk = await Produk.find({});

  res.send(produk);
});

export { router as showProdukRouter };
