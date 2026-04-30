import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@db";
import { Movement } from "@models/Movement";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const filter: any = { status: "processed" };

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                // If it's only a date string (YYYY-MM-DD), set to end of day in UTC
                if (endDate.length <= 10) {
                    end.setUTCHours(23, 59, 59, 999);
                }
                filter.createdAt.$lte = end;
            }
        }

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
        console.error("Reports API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
