import mongoose, { Schema, model, models } from "mongoose";

const StockSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        quantity: { type: Number, required: true, default: 0, min: 0 },
    },
    { timestamps: true }
);

// Compound unique index: one product per branch
StockSchema.index({ productId: 1, branchId: 1 }, { unique: true });

export const Stock =
    models.Stock || model("Stock", StockSchema);

