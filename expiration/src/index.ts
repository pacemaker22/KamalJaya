import { natsWrapper } from "./NatsWrapper";
import { OrderCreatedListener } from "./events/listeners/OrderCreatedListener";

const start = async () => {
  console.log("Starting...");
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID harus diisi");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL harus diisi");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID harus diisi");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Koneksi ke NATS terputus!!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
