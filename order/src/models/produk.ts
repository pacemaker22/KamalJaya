import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new produk
interface ProdukAttrs {
  id: string;
  nama: string;
  harga: number;
  userId: string;
  gambar: string;
  ukuran: string;
  warna?: string;
  kategori: string;
  deskripsi: string;
  jumlahStock: number;
  diPesan: boolean;
}

// An interface that describes the properties
// that a produk Model has
interface ProdukModel extends mongoose.Model<ProdukDoc> {
  build(attrs: ProdukAttrs): ProdukDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProdukDoc | null>;
}

// An interface that describes the properties
// that a produk Document has
export interface ProdukDoc extends mongoose.Document {
  nama: string;
  harga: number;
  userId: string;
  orderId: string;
  gambar: string;
  ukuran: string;
  warna: string;
  kategori: string;
  deskripsi: string;
  jumlahStock: number;
  diPesan: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const produkSchema = new mongoose.Schema<ProdukDoc, ProdukModel>(
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
    gambar: {
     type: String,
     required: true,
    },
    ukuran: {
      type: String,
      required: true,
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
    jumlahStock: {
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
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

produkSchema.set("versionKey", "version");
produkSchema.plugin(updateIfCurrentPlugin);

produkSchema.statics.findByEvent = (event: {
    id: string;
    version: number;
}) => {
    return Produk.findOne({
        _id: event.id,
        version: event.version -1,
    });
};

produkSchema.statics.build = (attrs: ProdukAttrs) => {
  return new Produk({
    _id: attrs.id,
    nama: attrs.nama,
    userId: attrs.userId,
    gambar: attrs.gambar,
    ukuran: attrs.ukuran,
    warna: attrs.warna,
    kategori: attrs.kategori,
    deskripsi: attrs.deskripsi,
    jumlahStock: attrs.jumlahStock,
    diPesan: attrs.diPesan,
  });
};

const Produk = mongoose.model<ProdukDoc, ProdukModel>(
  "Produk",
  produkSchema
);

export { Produk };
