import mongoose, { Schema, model, models } from "mongoose";

const BranchSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        location: { type: String, required: true },
    },
    { timestamps: true }
);

export const Branch =
    models.Branch || model("Branch", BranchSchema);

