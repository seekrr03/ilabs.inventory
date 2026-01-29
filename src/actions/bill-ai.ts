"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// This schema defines exactly what the AI should find in the bill image
const billSchema = z.object({
  vendorName: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    category: z.enum(["Food", "Stationery", "Toiletries"])
  })),
  total: z.number().positive(),
});

export async function extractBillData(imageUrl: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o"), // High-fidelity vision model for reading receipts
    schema: billSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract line items from this office bill. Categorize each item strictly into Food, Stationery, or Toiletries." },
          { type: "image", image: imageUrl },
        ],
      },
    ],
  });

  return object;
}