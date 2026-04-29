import { NextResponse } from "next/server";
import { connectDB } from "@db";
import { Movement } from "@models/Movement";
import { MovementValidation } from "@validations/Movement";
import { ZodError } from "zod";

// GET function to get a movement by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID not found" },
                { status: 404 }
            );
        }

        const movement = await Movement.findById(id)
            .populate("productId")
            .populate("originBranch")
            .populate("destinationBranch");

        if (!movement) {
            return NextResponse.json(
                { success: false, error: "Movement not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: movement,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch movement" },
            { status: 500 }
        );
    }
}

// PUT -> update movement by ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const updatedData = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Movement ID is required" },
                { status: 400 }
            );
        }

        // Get the current movement to check status
        const currentMovement = await Movement.findById(id);
        if (!currentMovement) {
            return NextResponse.json(
                { success: false, error: "Movement not found" },
                { status: 404 }
            );
        }

        // Only allow updating certain fields or if status is pending
        const allowedFields = ['reason', 'status', 'failureReason', 'retryCount'];
        const filteredData: any = {};

        for (const key of allowedFields) {
            if (key in updatedData) {
                filteredData[key] = updatedData[key];
            }
        }

        // If updating the movement details (not just status), validate it
        if (Object.keys(filteredData).some(k => !['status', 'failureReason', 'retryCount'].includes(k))) {
            const validatedData = MovementValidation.parse(updatedData);
            Object.assign(filteredData, validatedData);
        }

        const movement = await Movement.findByIdAndUpdate(id, filteredData, {
            new: true,
            runValidators: true,
        })
            .populate("productId")
            .populate("originBranch")
            .populate("destinationBranch");

        return NextResponse.json({
            success: true,
            data: movement,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    details: error.issues.map((err: any) => err.message),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to update movement" },
            { status: 500 }
        );
    }
}

// DELETE -> delete movement by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Movement ID is required" },
                { status: 400 }
            );
        }

        const movement = await Movement.findByIdAndDelete(id);

        if (!movement) {
            return NextResponse.json(
                { success: false, error: "Movement not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Movement deleted successfully",
            data: movement,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete movement" },
            { status: 500 }
        );
    }
}

