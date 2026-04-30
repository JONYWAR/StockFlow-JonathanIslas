import { NextResponse } from "next/server";
import { connectDB } from "@db";
import { Movement } from "@models/Movement";
import { MovementValidation } from "@validations/Movement";
import { processMovement } from "@/src/lib/worker";

// GET -> read all movements
export async function GET(request: Request) {
    try {
        await connectDB();

        const searchParams = new URL(request.url).searchParams;
        const id = searchParams.get("id");
        const status = searchParams.get("status");
        const branchId = searchParams.get("branchId");

        // If specific ID is requested
        if (id) {
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
        }

        // Build filter query
        const filter: any = {};
        if (status) filter.status = status;
        if (branchId) filter.originBranch = branchId;

        const movements = await Movement.find(filter)
            .populate("productId")
            .populate("originBranch")
            .populate("destinationBranch")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: movements,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch movements" },
            { status: 500 }
        );
    }
}

// POST -> create movement
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Validate request body with Zod
        const validatedData = MovementValidation.parse(body);

        console.log("Received request body:", validatedData);
        // Validate transfer: destination branch required for transfer type
        if (validatedData.movementType === 'transfer' && !validatedData.destinationBranch) {
            return NextResponse.json(
                { success: false, error: "Destination branch is required for transfer movements" },
                { status: 400 }
            );
        }

        // Create movement with pending status
        const movement = await Movement.create({
            ...validatedData,
            status: "pending",
        });

        // Fetch created movement with populated fields
        const createdMovement = await Movement.findById(movement._id)
            .populate("productId")
            .populate("originBranch")
            .populate("destinationBranch");

        // Process movement asynchronously (non-blocking)
        // This allows the API to return immediately while processing happens in background
        processMovement(movement._id.toString()).catch((error) => {
            console.error("Background worker error:", error);
        });

        return NextResponse.json(
            {
                success: true,
                data: createdMovement,
                message: "Movement created and queued for processing",
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create movement" },
            { status: 500 }
        );
    }
}

