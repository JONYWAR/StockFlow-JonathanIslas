import { NextResponse } from "next/server";
import { connectDB } from "@db";
import { Product } from "@models/Product";

// GET -> read products
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST -> create test product
export async function POST() {
    try {
        await connectDB();

        const product = await Product.create({
            sku: "TEST-" + Date.now(),
            name: "Test Product",
            price: 100,
            category: "Test",
        });

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Duplicate SKU" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create product" },
            { status: 500 }
        );
    }
}