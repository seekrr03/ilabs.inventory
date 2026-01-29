"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const billSchema = z.object({
  vendorName: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    category: z.string() // More flexible for testing
  })),
  total: z.number().positive(),
});

export async function extractBillData(imageUrl: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"), 
      schema: billSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract items from this bill for office inventory. If categories are unclear, use 'General'." },
            { type: "image", image: imageUrl },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    // This will print the REAL error in your VS Code terminal
    console.error("Gemini AI Error:", error);
    throw new Error("AI failed to process the image.");
  }
}