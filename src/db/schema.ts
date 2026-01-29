import { pgTable, uuid, text, integer, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Enums for fixed categories
export const categoryEnum = pgEnum("category", ["Food", "Stationery", "Toiletries"]);

// 2. Vendors Table (Core Feature #2)
export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("0.00"),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Inventory Table (Core Feature #1)
// Added .unique() to name to support stock upserts during bill processing
export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), 
  category: categoryEnum("category").notNull(),
  stockLevel: integer("stock_level").notNull().default(0),
  minStockThreshold: integer("min_stock_threshold").notNull().default(5),
  unit: text("unit").default("pcs"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 4. Bills Table (Core Feature #3)
// Stores the high-level data and the reference to the original receipt image
export const bills = pgTable("bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorName: text("vendor_name"), // Added this column
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending"), // Added this column
  imageUrl: text("image_url"),
  processedAt: timestamp("processed_at").defaultNow(),
});

// 5. Bill Items Table (Core Feature #3)
// Stores the specific items extracted by AI from the bill
export const billItems = pgTable("bill_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  billId: uuid("bill_id").references(() => bills.id, { onDelete: "cascade" }),
  inventoryId: uuid("inventory_id").references(() => inventory.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// 6. Define Relations
// This allows for clean "db.query" fetches like fetching a bill with all its items
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
  inventory: one(inventory, {
    fields: [billItems.inventoryId],
    references: [inventory.id],
  }),
}));