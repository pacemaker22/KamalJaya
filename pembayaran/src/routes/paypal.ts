import express, { Request, Response } from "express";
import { requireAuth } from "@kjbuku/common";

const router = express.Router();

router.get(
  "/api/config/paypal",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = process.env.PAYPAL_CLIENT_ID;
    res.status(200).send("testing 123");
  }
);

export { router as paypalRouter };
