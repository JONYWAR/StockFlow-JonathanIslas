import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Product } from "@models/Product";
import { Movement } from "@models/Movement";
import { Stock } from "@models/Stock";
import { ProductValidation } from "@validations/Product";
import { ZodError } from "zod";

// GET function to get a product by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

    try {
        // connection to database
        await connectDB();

        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID not found" },
                { status: 404 }
            );

        }
        // Using Mongoose to find a product by ID and return it or error message if not found
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

// PUT -> update product by ID
export async function PUT(request: Request, { params } :{ params : Promise<{ id: string }> }) {
    try {
        // same as GET, we first connect to the database, then find the product by ID
        await connectDB();

        const { id } = await params;
        const updatedData = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Validate update data with Zod for easy error handling
        const validatedData = ProductValidation.parse(updatedData);

        // Update the product with the validated data and error handling
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

        // in case of ZodError, return the validation errors
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

// DELETE -> delete product by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Connection to database and find product by ID to delete it, if not found return error message
        await connectDB();

        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Check if there are any movements associated with this product
        const movementCount = await Movement.countDocuments({ productId: id });
        if (movementCount > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot delete product because it has associated movements. This is required for historical records." 
                },
                { status: 400 }
            );
        }

        // Check if there is any stock for this product
        const stocks = await Stock.find({ productId: id, quantity: { $gt: 0 } });
        if (stocks.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot delete product with existing stock in branches." 
                },
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
