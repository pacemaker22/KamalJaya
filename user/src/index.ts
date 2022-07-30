import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY harus didefisinikan");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI harus didefisinikan");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Terhubung ke MongoDB!!");
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`server user: terhubung ke port ${port}`);
  });
};

start();
