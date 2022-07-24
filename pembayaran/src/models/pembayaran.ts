import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PembayaranAttrs {
  orderId: string;
  stripeId: string;
}

interface PembayaranDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  createdAt: string;
  updatedAt: string;
}

interface PembayaranModel extends mongoose.Model<PembayaranDoc> {
  build(attrs: PembayaranAttrs): PembayaranDoc;
}

const pembayaranSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
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

pembayaranSchema.statics.build = (attrs: PembayaranAttrs) => {
  return new Pembayaran(attrs);
};

const Pembayaran = mongoose.model<PembayaranDoc, PembayaranModel>(
  "Pembayaran",
  pembayaranSchema
);

export { Pembayaran };
