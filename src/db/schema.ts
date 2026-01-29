import { pgTable, text, uuid, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Vendors Table
export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactEmail: text("contact_email"),
  category: text("category"), // e.g., Food, Stationery
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Bills Table (Updated for AI extraction)
export const bills = pgTable("bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id), // Fixes image_2810f0
  vendorName: text("vendor_name"), // Fixes image_287250
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // Fixes image_286ec8
  imageUrl: text("image_url"),
  processedAt: timestamp("processed_at").defaultNow(),
});

// 3. Bill Items (Line items extracted by Gemini)
export const billItems = pgTable("bill_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  billId: uuid("bill_id").references(() => bills.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// 4. Inventory Table
export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  stockLevel: integer("stock_level").default(0).notNull(),
  minStockThreshold: integer("min_stock_threshold").default(5).notNull(), // Fixes image_280cd6
  unit: text("unit").default("pcs"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 5. Relations (For easier Drizzle queries)
export const vendorsRelations = relations(vendors, ({ many }) => ({
  bills: many(bills),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [bills.vendorId],
    references: [vendors.id],
  }),
  items: many(billItems),
}));

export const billItemsRelations = relations(billItems, ({ one }) => ({
  bill: one(bills, {
    fields: [billItems.billId],
    references: [bills.id],
  }),
}));