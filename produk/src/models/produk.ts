import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface GambarInterface {
  gambar1: string;
  gambar2?: string;
}

// An interface that describes the properties
// that are requried to create a new produk
interface produkAttrs {
  nama: string;
  harga: number;
  userId: string;
  gambarItem: GambarInterface;
  warna: string;
  kategori: string;
  deskripsi: string;
  jumlahStok: number;
  diPesan: boolean;
}

// An interface that describes the properties
// that a produk Document has

interface ProdukModel extends mongoose.Model<ProdukDoc> {
  build(attrs: produkAttrs): ProdukDoc;
}

interface ProdukDoc extends mongoose.Document {
  nama: string;
  harga: number;
  userId: string;
  orderId: string;
  gambarItem: GambarInterface;
  warna: string;
  kategori: string;
  deskripsi: string;
  jumlahStok: number;
  diPesan: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const produkSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    gambarItem: {
      gambar1: { type: String, required: true },
      gambar2: { type: String },
    },
    warna: { type: String },
    kategori: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    jumlahStok: {
      type: Number,
      required: true,
      default: 1,
    },
    diPesan: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);


produkSchema.set("versionKey", "version");
produkSchema.plugin(updateIfCurrentPlugin);

produkSchema.statics.build = (attrs: produkAttrs) => {
  return new Produk(attrs);
};

const Produk = mongoose.model<ProdukDoc, ProdukModel>(
  "Produk",
  produkSchema
);

export { Produk };
