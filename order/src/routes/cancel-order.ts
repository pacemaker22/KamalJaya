import express, { Request, Response } from "express";
import {
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
  "/api/orders/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Object ID tidak valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Dibatalkan;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Dibatalkan,
      userId: order.userId,
      expiresAt: order.expiresAt,
      version: order.version,
      cart: order.cart,
      metodePembayaran: order.metodePembayaran,
      hargaItem: order.hargaItem,
      ongkir: order.ongkir,
      hargaTotal: order.hargaTotal,
      isBayar: order.isBayar,
      isTerkirim: order.isTerkirim,
      tanggalSampai: order.tanggalSampai,
    });

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
