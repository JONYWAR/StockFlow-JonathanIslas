import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Branch } from "@models/Branch";
import { Movement } from "@models/Movement";
import { Stock } from "@models/Stock";
import { BranchValidation } from "@validations/Branch";
import { ZodError } from "zod";

// GET function to get a branch by ID
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
        // Using Mongoose to find a branch by ID and return it or error message if not found
        const branch = await Branch.findById(id);
        if (!branch) {
            return NextResponse.json(
                { success: false, error: "Branch not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            data: branch,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch branch" },
            { status: 500 }
        );
    }
}

// PUT -> update branch by ID
export async function PUT(request: Request, { params } :{ params : Promise<{ id: string }> }) {
    try {
        // same as GET, we first connect to the database, then find the branch by ID
        await connectDB();

        const { id } = await params;
        const updatedData = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Branch ID is required" },
                { status: 400 }
            );
        }

        // Validate update data with Zod for easy error handling
        const validatedData = BranchValidation.parse(updatedData);

        // Update the branch with the validated data and error handling
        const branch = await Branch.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        });

        if (!branch) {
            return NextResponse.json(
                { success: false, error: "Branch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: branch,
        });

    } catch (error: any) {

        // in case of ZodError, return the validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues.map((err: any) => err.message)},
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Duplicate branch name" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to update branch" },
            { status: 500 }
        );
    }
}

// DELETE -> delete branch by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Connection to database and find branch by ID to delete it, if not found return error message
        await connectDB();

        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Branch ID is required" },
                { status: 400 }
            );
        }

        // Check if there are any movements associated with this branch
        const movementCount = await Movement.countDocuments({
            $or: [{ originBranch: id }, { destinationBranch: id }],
        });
        if (movementCount > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot delete branch because it has associated movements. This is required for historical records." 
                },
                { status: 400 }
            );
        }

        // Check if there is any stock in this branch
        const stocks = await Stock.find({ branchId: id, quantity: { $gt: 0 } });
        if (stocks.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot delete branch because it currently has product stock." 
                },
                { status: 400 }
            );
        }

        const branch = await Branch.findByIdAndDelete(id);

        if (!branch) {
            return NextResponse.json(
                { success: false, error: "Branch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Branch deleted successfully",
            data: branch,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete branch" },
            { status: 500 }
        );
    }
}

