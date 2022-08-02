import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@kjbuku/common";
import { param } from "express-validator";

import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { OrderUpdatedPublisher } from "../events/publishers/OrderUpdatedPublisher";

const router = express.Router();

router.patch(
  "/api/orders/:orderId/deliver",
  requireAuth,
  [param("orderId").isMongoId().withMessage("ObjectId Salah")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // hanya admin yang dapt melakukan request
    if (req.currentUser!.isAdmin !== true) {
      throw new NotAuthorizedError();
    }

    if (order.status !== OrderStatus.Selesai) {
      throw new BadRequestError("Order belum dibayarkan");
    }

    order.set({ isTerkirim: true, tanggalKirim: new Date() });
    await order.save();

    //publish event bahwa order batal
    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: order.cart,
      metodePembayaran: order.metodePembayaran,
      hargaItem: order.hargaItem,
      ongkir: order.ongkir,
      hargaTotal: order.hargaTotal,
      isBayar: order.isBayar,
      isTerkirim: true,
      tanggalKirim: new Date(),
    });

    res.status(200).send(order);
  }
);

export { router as deliverOrderRouter };
