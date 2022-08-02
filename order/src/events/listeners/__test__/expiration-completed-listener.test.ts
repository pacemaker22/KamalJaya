import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, ExpirationCompletedEvent } from "@kjbuku/common";
import { ExpirationCompletedListener } from "../ExpirationCompletedListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Order } from "../../../models/order";
import { Produk } from "../../../models/produk";

const setup = async () => {
    const listener = new ExpirationCompletedListener(natsWrapper.client);

    const produk = Produk.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        nama: " Celana SD",
        harga: 25000,
        userId: new mongoose.Types.ObjectId().toHexString(),
        kategori: "Seragam SD",
        deskripsi: "Seragam untuk anak SD",
        gambar: "asdasdad",
        warna: "Merah",
        jumlahStok: 1,
        diPesan: false,
      });
      await produk.save();

    const hargaItem = parseFloat(produk.harga.toFixed(2));

    const order = Order.build({
        status: OrderStatus.Dibuat,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        metodePembayaran: "stripe",
        hargaItem: hargaItem,
        ongkir: 0.0,
        hargaTotal: hargaItem,
    });

    await order.save();
    
    const data: ExpirationCompletedEvent["data"] = {
        orderId: order.id,
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, order, produk, data, msg };
}

it("update status order jadi dibatalkan", async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
});

it("ack Message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})