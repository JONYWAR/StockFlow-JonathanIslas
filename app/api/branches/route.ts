import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Branch } from "@models/Branch";
import { BranchValidation } from "@validations/Branch";
import {ZodError} from "zod";

// GET -> read all branches
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const branches = await Branch.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: branches,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch branches" },
            { status: 500 }
        );
    }
}

// POST -> create branch
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        // Validate request body with Zod
        const validatedData = BranchValidation.parse(body);
        const branch = await Branch.create(validatedData);
        return NextResponse.json(
            {
                success: true,
                data: branch,
            },
            { status: 201 }
        );
    } catch (error: any) {

        // in case of ZodError, return the validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues.map((err: any) => err.message)},
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create branch" },
            { status: 500 }
        );
    }
}

