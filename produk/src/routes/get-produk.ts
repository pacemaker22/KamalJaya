import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "@kjbuku/common";
import { Produk } from '../models/produk'

const router = express.Router();

router.get(
  "/api/produk/:produkId",
  [param("produkId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const produk = await Produk.findById(req.params.produkId);

    if (!produk) {
      throw new NotFoundError();
    }

    res.send(produk);
  }
);

export { router as getProdukRouter };
