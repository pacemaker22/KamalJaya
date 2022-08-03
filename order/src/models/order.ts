import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from "@kjbuku/common";

export interface CartAttrs {
    userId: string;
    nama: string;
    kuantitas: number;
    warna: string;
    gambar: string;
    harga: number;
    jumlahStok: number;
    produkId: string;
}

interface alamatKirimAttrs {
    address: string;
    kota: string;
    kodePos: string;
}

interface OrderAttrs {
    userId: string;
    cart?: Array<CartAttrs>;
    status: OrderStatus;
    metodePembayaran: string;
    alamatKirim?: alamatKirimAttrs;
    hargaItem: number;
    ongkir: number;
    hargaTotal: number;
    isBayar?: boolean;
    isTerkirim?: boolean;
    tanggalBayar?: Date;
    tanggalKirim?: Date;
    tanggalSampai?: Date;
    expiresAt: Date;
}


interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    cart?: Array<CartAttrs>;
    status: OrderStatus;
    version: number;
    metodePembayaran: string;
    alamatKirim?: alamatKirimAttrs;
    hargaItem: number;
    ongkir: number;
    hargaTotal: number;
    isBayar?: boolean;
    isTerkirim?: boolean;
    tanggalBayar?: Date;
    tanggalKirim?: Date;
    tanggalSampai?: Date;
    expiresAt: Date;
    createdAt: string;
    updatedAt: string;
}

const orderSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Dibuat,
      },
      cart: [
        {
            userId: { type: String, required: true },
            nama: { type: String, required: true },
            kuantitas: { type: Number, required: true },
            warna: { type: String, required: true },
            gambar: { type: String, required: true },
            jumlahStok: { type: String, required: true },
            harga: { type: Number, required: true },
            produkId: { type: String, required: true },
        },
      ],
      metodePembayaran: {
        type: String,
        required: true,
        default: "stripe",
      },
      alamatKirim: {
        alamat: { type: String },
        kota: { type: String },
        kodePos: { type: String },
      },
      hargaItem: {
        type: Number,
        required: true,
        default: 0.0,
      },
      ongkir: {
        type: Number,
        required: true,
        default: 0.0,
      },
      hargaTotal: {
        type: Number,
        required: true,
        default: 0.0,
      },
      isBayar: {
        type: Boolean,
        default: false,
      },
      isTerkirim: {
        type: Boolean,
        default: false,
      },
      tanggalBayar: {
        type: Date,
      },
      tanggalKirim: {
        type: Date,
      },
      tanggalSampai: {
        type: Date,
      },
      expiresAt: {
        type: Date,
      }
    },
    {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
      },
      timestamps: true,
    }
  );

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
  };
  
  const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
  
  export { Order };
  