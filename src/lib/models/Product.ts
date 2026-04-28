import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
    {
        sku: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
    },
    { timestamps: true }
);

export const Product =
    models.Product || model("Product", ProductSchema);