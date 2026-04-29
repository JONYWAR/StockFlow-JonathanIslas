import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Product } from "@models/Product";
import { ProductValidation } from "@validations/Product";
import { ZodError } from "zod";

// GET -> read all products
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

    try {
        await connectDB();

        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID not found" },
                { status: 404 }
            );

        }

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

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// PUT -> update product
export async function PUT(request: Request, { params } :{ params : Promise<{ id: string }> }) {
    try {
        await connectDB();

        const { id } = await params;
        const updatedData = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Validate update data with Zod
        const validatedData = ProductValidation.parse(updatedData);

        const product = await Product.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        });

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

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Duplicate SKU" },
                { status: 400 }
            );
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues.map((err: any) => err.message)},
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE -> delete product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
