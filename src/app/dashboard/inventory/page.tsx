import { db } from "@/db";
import { inventory } from "@/db/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle } from "lucide-react";

export default async function InventoryPage() {
  // Fetch data directly from DB using Server Component
  const items = await db.select().from(inventory);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Office Inventory</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track stock levels for iLabs supplies.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  <Package className="mx-auto h-10 w-10 opacity-20 mb-2" />
                  No items found. Try processing a bill!
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isLowStock = item.stockLevel <= item.minStockThreshold;
                
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isLowStock ? "text-destructive font-bold" : "text-slate-700"}>
                        {item.stockLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge variant="destructive" className="gap-1 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                          Healthy
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-mono text-xs">
                      {item.unit || "pcs"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}