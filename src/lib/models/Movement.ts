import mongoose, { Schema, model, models } from "mongoose";

const MovementSchema = new Schema(
    {
        movementType: {
            type: String,
            enum: ["entry", "out", "transfer"],
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        status: {
            type: String,
            enum: ["pending", "processed", "failed"],
            default: "pending",
        },
        originBranch: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        destinationBranch: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
            required: false,
        },
        reason: { type: String, required: false },
        failureReason: { type: String, required: false },
        retryCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Movement =
    models.Movement || model("Movement", MovementSchema);

