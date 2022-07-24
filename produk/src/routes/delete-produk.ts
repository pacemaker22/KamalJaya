import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  adminUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@kjbuku/common";

import { Produk } from "../models/produk";
import { ProdukDeletedPublisher } from "../events/publishers/ProdukDeletedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.delete(
  "/api/produk/:produkId",
  requireAuth,
  adminUser,
  [param("produkId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const deletedProduk = await Produk.findById(req.params.produkId);

    // Check the product is existing
    if (!deletedProduk) {
      throw new NotFoundError();
    }

    deletedProduk.remove();

    // Publish an event
    await new ProdukDeletedPublisher(natsWrapper.client).publish({
      id: deletedProduk.id,
      version: deletedProduk.version,
    });

    res.status(200).send({});
  }
);

export { router as deleteProdukRouter };
