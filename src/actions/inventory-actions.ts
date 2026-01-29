"use server";

import { db } from "@/db";
import { inventory, bills, billItems } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function installBillData(data: any) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Create the Bill record
      const [newBill] = await tx.insert(bills).values({
        vendorName: data.vendorName,
        totalAmount: data.total.toString(),
        status: "processed",
      }).returning();

      // 2. Process each item
      for (const item of data.items) {
        await tx.insert(billItems).values({
          billId: newBill.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price.toString(),
        });

        // 3. Upsert into Inventory
        await tx.insert(inventory)
          .values({
            name: item.name,
            category: item.category,
            stockLevel: item.quantity,
          })
          .onConflictDoUpdate({
            target: inventory.name,
            set: {
              stockLevel: sql`${inventory.stockLevel} + ${item.quantity}`,
            },
          });
      }

      revalidatePath("/dashboard/inventory");
      return { success: true };
    });
  } catch (error) {
    console.error("Installation failed:", error);
    return { success: false, error: "Database update failed." };
  }
}