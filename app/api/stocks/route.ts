import { NextResponse } from "next/server";
import { connectDB } from "@db";
import { Stock } from "@models/Stock";

// GET -> read all stocks with populated references
export async function GET(request: Request) {
    try {
        await connectDB();

        const searchParams = new URL(request.url).searchParams;
        const productId = searchParams.get("productId");
        const branchId = searchParams.get("branchId");

        // Build filter
        const filter: any = {};
        if (productId) filter.productId = productId;
        if (branchId) filter.branchId = branchId;

        const stocks = await Stock.find(filter)
            .populate("productId")
            .populate("branchId")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: stocks,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch stocks" },
            { status: 500 }
        );
    }
}

