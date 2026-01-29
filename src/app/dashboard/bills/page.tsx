"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { extractBillData } from "@/actions/bill-ai";
import { installBillData } from "@/actions/inventory-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BillsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // --- Logic to save data to Neon DB ---
  const handleInstall = async () => {
    setIsProcessing(true);
    try {
      const result = await installBillData(extractedData);
      
      if (result.success) {
        toast.success("Inventory updated successfully!");
        setExtractedData(null); // Clear for next upload
      } else {
        // Fix for ts(2339) using type assertion
        const errorMsg = (result as { error?: string }).error || "Failed to install data.";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">iLabs Bill Processing</h1>
        <p className="text-muted-foreground">Upload a bill to extract items and update inventory.</p>
      </div>
      
      {!extractedData ? (
        <Card className="border-dashed bg-slate-50/50">
          <CardContent className="pt-6">
            <UploadDropzone
              endpoint="billUploader"
              onUploadBegin={() => {
                console.log("🚀 Upload starting...");
                setIsProcessing(true);
              }}
              onClientUploadComplete={async (res) => {
                console.log("✅ Upload Successful! Res:", res);
                try {
                  const url = res[0].url;
                  const data = await extractBillData(url);
                  setExtractedData(data);
                  toast.success("AI Extraction Complete!");
                } catch (error) {
                  console.error("❌ AI Error:", error);
                  toast.error("AI failed to read bill.");
                } finally {
                  setIsProcessing(false);
                }
              }}
              onUploadError={(error) => {
                console.error("⚠️ UploadThing Error:", error.message);
                setIsProcessing(false);
                toast.error(`Upload Error: ${error.message}`);
              }}
            />
            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gemini is reading your bill...</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle>Extracted: {extractedData.vendorName}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setExtractedData(null)}>
              Upload Another
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Data Preview */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 font-bold text-sm border-b pb-2">
                <span>Item</span>
                <span>Category</span>
                <span>Qty</span>
                <span className="text-right">Price</span>
              </div>
              {extractedData.items?.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-4 py-2 border-b last:border-0 text-sm">
                  <span>{item.name}</span>
                  <span>{item.category}</span>
                  <span>{item.quantity}</span>
                  <span className="text-right">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end gap-3 pt-4">
               <div className="text-lg font-bold">Total: ${extractedData.total?.toFixed(2)}</div>
               <Button 
                onClick={handleInstall} 
                disabled={isProcessing}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Confirm & Update Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}