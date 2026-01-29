"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { extractBillData } from "@/actions/bill-ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function BillsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bill Processing</h1>
        <p className="text-muted-foreground">Upload an office bill to extract items via Gemini AI.</p>
      </div>

      {!extractedData ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <UploadDropzone
              endpoint="billUploader"
              onUploadBegin={() => setIsProcessing(true)}
              onClientUploadComplete={async (res) => {
                const url = res[0].url;
                try {
                  const data = await extractBillData(url);
                  setExtractedData(data);
                  toast.success("AI Extraction Complete!");
                } catch (error) {
                  toast.error("AI processing failed. Check your API key.");
                } finally {
                  setIsProcessing(false);
                }
              }}
              onUploadError={(error: Error) => {
                setIsProcessing(false);
                toast.error(`Upload Error: ${error.message}`);
              }}
            />
            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gemini is reading your bill...</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Extracted Data: {extractedData.vendorName}</CardTitle>
            <Button variant="outline" onClick={() => setExtractedData(null)}>
              Upload Another
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 font-bold border-b pb-2">
                <span>Item</span>
                <span>Category</span>
                <span>Qty</span>
                <span className="text-right">Price</span>
              </div>
              {extractedData.items.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-4 py-2 border-b last:border-0">
                  <span>{item.name}</span>
                  <span>{item.category}</span>
                  <span>{item.quantity}</span>
                  <span className="text-right">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Confirm & Update Inventory
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}