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

  const handleInstall = async () => {
    setIsProcessing(true);
    try {
      const result = await installBillData(extractedData);
      if (result.success) {
        toast.success("Inventory updated successfully!");
        setExtractedData(null);
      } else {
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
      <h1 className="text-2xl font-bold">iLabs Bill Processing</h1>
      
      {!extractedData ? (
        <Card className="border-dashed bg-slate-50/50">
          <CardContent className="pt-6">
            <UploadDropzone
              endpoint="billUploader"
              onUploadBegin={() => setIsProcessing(true)}
              onClientUploadComplete={async (res) => {
                try {
                  const data = await extractBillData(res[0].url);
                  setExtractedData(data);
                  toast.success("AI Extraction Complete!");
                } catch (error) {
                  toast.error("AI failed to read bill.");
                } finally {
                  setIsProcessing(false);
                }
              }}
              onUploadError={(error) => {
                setIsProcessing(false);
                toast.error(`Upload Error: ${error.message}`);
              }}
            />
            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Review: {extractedData.vendorName}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setExtractedData(null)}>Clear</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 font-bold border-b pb-2">
              <span>Item</span><span>Qty</span><span className="text-right">Price</span>
            </div>
            {extractedData.items?.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-4 py-2 border-b last:border-0">
                <span>{item.name}</span><span>{item.quantity}</span><span className="text-right">${item.price}</span>
              </div>
            ))}
            <Button onClick={handleInstall} disabled={isProcessing} className="w-full bg-green-600">
              {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Confirm & Update
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}