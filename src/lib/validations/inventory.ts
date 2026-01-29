import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["Food", "Stationery", "Toiletries"]),
  stockLevel: z.number().int().nonnegative(),
  minStockThreshold: z.number().int().nonnegative().default(5),
  unit: z.string().default("pcs"),
});

export type InventoryInput = z.infer<typeof inventorySchema>;