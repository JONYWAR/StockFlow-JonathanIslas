import { NextResponse } from "next/server";
import { processMovement, processAllPendingMovements } from "@/src/lib/worker";

/**
 * POST /api/workers/process-movements
 * Processes pending movements
 *
 * Query params:
 * - movementId: Process a specific movement (optional)
 * - processAll: true to process all pending movements (default: false)
 */
export async function POST(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const movementId = searchParams.get("movementId");
    const processAll = searchParams.get("processAll") === "true";

    if (processAll) {
      // Process all pending movements
      await processAllPendingMovements();
      return NextResponse.json(
        {
          success: true,
          message: "All pending movements processed",
        },
        { status: 200 }
      );
    } else if (movementId) {
      // Process specific movement
      const result = await processMovement(movementId);
      return NextResponse.json(
        {
          success: result.success,
          message: result.message,
          data: result.movement,
        },
        { status: result.success ? 200 : 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either movementId or processAll=true is required",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: `Worker error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workers/process-movements
 * Health check and status
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Worker service is running",
      endpoints: {
        POST: {
          "?movementId=<id>": "Process specific movement",
          "?processAll=true": "Process all pending movements",
        },
      },
    },
    { status: 200 }
  );
}
