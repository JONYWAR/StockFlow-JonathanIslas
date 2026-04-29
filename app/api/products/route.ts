import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Product } from "@models/Product";
import { ProductValidation } from "@validations/Product";
import {ZodError} from "zod";

// GET -> read all products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (id) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json(
                    { success: false, error: "Product not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                data: product,
            });
        }

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

// POST -> create product
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        // Validate request body with Zod
        const validatedData = ProductValidation.parse(body);
        const product = await Product.create(validatedData);
        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Duplicate SKU" },
                { status: 400 }
            );
        }

        // in case of ZodError, return the validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues.map((err: any) => err.message)},
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create product" },
            { status: 500 }
        );
    }
}
