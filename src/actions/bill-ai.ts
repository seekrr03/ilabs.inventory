"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google"; // Use Google instead of OpenAI
import { z } from "zod";

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
    model: google("gemini-1.5-flash"), // Gemini Flash is fast and free!
    schema: billSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract items from this bill for iLabs office inventory." },
          { type: "image", image: imageUrl },
        ],
      },
    ],
  });

  return object;
}