import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@kjbuku/common";

import { createProdukRouter } from "./routes/create-produk";
import { getProdukRouter } from "./routes/get-produk";
import { showProdukRouter } from "./routes/show-produk";
import { updateProdukRouter } from "./routes/update-produk";
import { deleteProdukRouter } from "./routes/delete-produk";
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
	})
);
app.use(currentUser);

app.use(showProdukRouter);
app.use(createProdukRouter);
app.use(updateProdukRouter);
app.use(deleteProdukRouter);
app.use(getProdukRouter);


app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
