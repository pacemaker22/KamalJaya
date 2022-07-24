import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@kjbuku/common";

// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  metodePembayaran: string;
  hargaItem: number;
  ongkir: number;
  hargaTotal: number;
  isBayar?: boolean;
  tanggalBayar?: Date;
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    version: number;
    metodePembayaran: string;
    hargaItem: number;
    ongkir: number;
    hargaTotal: number;
    isBayar: boolean;
    tanggalBayar?: Date;
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
    metodePembayaran: {
      type: String,
      required: true,
      default: "stripe",
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
    tanggalBayar: {
      type: Date,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    id: event.id,
    version: event.version - 1,
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    version: attrs.version,
    metodePembayaran: attrs.metodePembayaran,
    hargaItem: attrs.hargaItem,
    ongkir: attrs.ongkir,
    hargaTotal: attrs.hargaTotal,
    isBayar: attrs.isBayar,
    tanggalBayar: attrs.tanggalBayar,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
