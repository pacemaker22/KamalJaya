import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@kjbuku/common";
import { json } from 'body-parser';
import { createPembayaranRouter } from "./routes/create-pembayaran";
import { getPembayaranRouter } from "./routes/get-pembayaran";
import { paypalRouter } from "./routes/paypal";
import { showProdukRouter } from "./routes/show-produk";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV === "production",
	})
);
app.use(currentUser);

app.use(showProdukRouter);
app.use(createPembayaranRouter);
app.use(getPembayaranRouter);
app.use(paypalRouter);

app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
