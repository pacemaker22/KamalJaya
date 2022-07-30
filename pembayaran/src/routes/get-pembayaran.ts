import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
} from "@kjbuku/common";
import { param } from "express-validator";
import { Pembayaran } from "../models/pembayaran";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/pembayaran/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("ObjectId MongoDB tidak valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const pembayaran = await Pembayaran.find({ orderId: req.params.orderId });

    if (!pembayaran) {
      throw new NotFoundError();
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Only admin *OR* the user who request that order can only access the order
    if (
      order.userId !== req.currentUser!.id &&
      req.currentUser!.isAdmin === false
    ) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(pembayaran);
  }
);

export { router as getPembayaranRouter };
