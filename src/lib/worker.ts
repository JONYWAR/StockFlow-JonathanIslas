import { connectDB } from "@db";
import { Movement } from "@models//Movement";
import { Stock } from "@models/Stock";

interface ProcessResult {
  success: boolean;
  message: string;
  movement?: any;
}

/**
 * Process a single movement:
 * - Validate stock availability (for out/transfer)
 * - Update stock in database
 * - Update movement status to "processed" or "failed"
 */
export async function processMovement(
  movementId: string
): Promise<ProcessResult> {
  try {
    await connectDB();

    // Fetch movement with references
    const movement = await Movement.findById(movementId)
      .populate("productId")
      .populate("originBranch")
      .populate("destinationBranch");

    if (!movement) {
      return {
        success: false,
        message: "Movement not found",
      };
    }

    // Skip if already processed or failed
    if (movement.status !== "pending") {
      return {
        success: false,
        message: `Movement is already ${movement.status}`,
      };
    }

    try {
      // Process based on movement type
      if (movement.movementType === "entry") {
        await processEntry(movement);
      } else if (movement.movementType === "out") {
        await processOut(movement);
      } else if (movement.movementType === "transfer") {
        await processTransfer(movement);
      } else {
        throw new Error(`Unsupported movement type: ${movement.movementType}`);
      }

      // Update movement status to processed
      movement.status = "processed";
      movement.failureReason = null;
      await movement.save();

      return {
        success: true,
        message: `Movement ${movement.movementType} processed successfully`,
        movement,
      };
    } catch (processError: any) {
      // Handle processing errors with retry logic
      const maxRetries = 1;
      const currentRetries = movement.retryCount || 0;

      if (currentRetries < maxRetries) {
        // Retry logic: increment retry count and keep as pending
        movement.retryCount = currentRetries + 1;
        await movement.save();

        // Wait 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Attempt retry
        try {
          if (movement.movementType === "entry") {
            await processEntry(movement);
          } else if (movement.movementType === "out") {
            await processOut(movement);
          } else if (movement.movementType === "transfer") {
            await processTransfer(movement);
          }

          // Retry succeeded: update movement status to processed
          movement.status = "processed";
          movement.failureReason = null;
          await movement.save();

          return {
            success: true,
            message: `Movement ${movement.movementType} processed successfully on retry`,
            movement,
          };
        } catch (retryError: any) {
          // Retry failed: mark as failed
          movement.status = "failed";
          movement.failureReason =
            retryError.message || "Processing failed after retry";
          await movement.save();

          return {
            success: false,
            message: `Movement marked as failed: ${movement.failureReason}`,
            movement,
          };
        }
      } else {
        // Max retries exceeded: mark as failed
        movement.status = "failed";
        movement.failureReason =
          processError.message ||
          "Processing failed after retries";
        movement.retryCount = currentRetries + 1;
        await movement.save();

        return {
          success: false,
          message: `Movement marked as failed: ${movement.failureReason}`,
          movement,
        };
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Worker error: ${error.message}`,
    };
  }
}

/**
 * Process entry movement:
 * Creates or updates stock in origin branch
 */
async function processEntry(movement: any): Promise<void> {
  const { productId, originBranch, quantity } = movement;

  // Find or create stock (unique per product-branch)
  let stock = await Stock.findOne({
    productId: productId._id,
    branchId: originBranch._id,
  });

  if (!stock) {
    stock = new Stock({
      productId: productId._id,
      branchId: originBranch._id,
      quantity: quantity,
    });
  } else {
    stock.quantity += quantity;
  }

  await stock.save();
}

/**
 * Process out movement:
 * Reduces stock from origin branch
 * Validates sufficient stock exists
 */
async function processOut(movement: any): Promise<void> {
  const { productId, originBranch, quantity } = movement;

  // Find stock
  const stock = await Stock.findOne({
    productId: productId._id,
    branchId: originBranch._id,
  });

  if (!stock) {
    throw new Error(
      `No stock found for product ${productId.name} in branch ${originBranch.name}`
    );
  }

  if (stock.quantity < quantity) {
    throw new Error(
      `Insufficient stock. Available: ${stock.quantity}, Requested: ${quantity}`
    );
  }

  stock.quantity -= quantity;
  await stock.save();
}

/**
 * Process transfer movement:
 * Moves stock from origin to destination branch
 * Validates sufficient stock in origin
 */
async function processTransfer(movement: any): Promise<void> {
  const { productId, originBranch, destinationBranch, quantity } = movement;

  // Validate destination branch exists
  if (!destinationBranch) {
    throw new Error("Destination branch is required for transfer");
  }

  // Find stock in origin branch
  const originStock = await Stock.findOne({
    productId: productId._id,
    branchId: originBranch._id,
  });

  if (!originStock) {
    throw new Error(
      `No stock found for product ${productId.name} in origin branch ${originBranch.name}`
    );
  }

  if (originStock.quantity < quantity) {
    throw new Error(
      `Insufficient stock in origin branch. Available: ${originStock.quantity}, Requested: ${quantity}`
    );
  }

  // Reduce from origin
  originStock.quantity -= quantity;
  await originStock.save();

  // Find or create stock in destination branch (unique per product-branch)
  let destinationStock = await Stock.findOne({
    productId: productId._id,
    branchId: destinationBranch._id,
  });

  if (!destinationStock) {
    destinationStock = new Stock({
      productId: productId._id,
      branchId: destinationBranch._id,
      quantity: quantity,
    });
  } else {
    destinationStock.quantity += quantity;
  }

  await destinationStock.save();
}

/**
 * Process all pending movements
 * Useful for cron jobs or background tasks
 */
export async function processAllPendingMovements(): Promise<void> {
  try {
    await connectDB();

    const pendingMovements = await Movement.find({ status: "pending" });

    console.log(`Processing ${pendingMovements.length} pending movements...`);

    for (const movement of pendingMovements) {
      const result = await processMovement(movement._id.toString());
      console.log(
        `Movement ${movement._id}: ${result.success ? "✓" : "✗"} - ${result.message}`
      );
    }
  } catch (error) {
    console.error("Error processing all movements:", error);
  }
}
