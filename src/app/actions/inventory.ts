"use server";

import { db } from "@/db";
import { inventory } from "@/db/schema";
import { inventorySchema } from "@/lib/validations/inventory";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(data: unknown) {
  // 1. Validate the data on the server
  const result = inventorySchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid input data" };
  }

  try {
    // 2. Insert into Vercel Postgres using Drizzle
    await db.insert(inventory).values({
      name: result.data.name,
      category: result.data.category,
      stockLevel: result.data.stockLevel,
      minStockThreshold: result.data.minStockThreshold,
      unit: result.data.unit,
    });

    // 3. Refresh the UI
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create item in database" };
  }
}