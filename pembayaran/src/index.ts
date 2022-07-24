import mongoose from "mongoose";
import { app } from "./app";
import { OrderUpdatedListener } from "./events/listeners/OrderUpdatedListener";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";
import { ProdukCreatedListener } from "./events/listeners/ProdukCreatedListener";
import { ProdukDeletedListener } from "./events/listeners/ProdukDeletedListener";
import { ProdukUpdatedListener } from "./events/listeners/ProdukUpdatedListener";
import { natsWrapper } from "./NatsWrapper";

const start = async () => {
  console.log("Starting...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY tidak ditemukan");
  }
  if (!process.env.MONGO_URI_PAYMENT) {
    throw new Error("MONGO_URI tidak ditemukan");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID tidak ditemukan");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL tidak ditemukan");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID tidak ditemukan");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Koneksi ke NATS terputus");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ProdukCreatedListener(natsWrapper.client).listen();
    new ProdukUpdatedListener(natsWrapper.client).listen();
    new ProdukDeletedListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI_PAYMENT);
    console.log("Terhubung ke MongoDB");
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server Pembayaran terhubung ke port: ${port}`);
  });
};

start();
