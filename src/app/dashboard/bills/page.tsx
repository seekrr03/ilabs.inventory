"use client";
import { UploadDropzone } from "@/lib/uploadthing"; // You'll need to create this util
import { useState } from "react";
import { extractBillData } from "@/actions/bill-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upload Bill (AI OCR)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadDropzone
              endpoint="billUploader"
              onClientUploadComplete={async (res) => {
                setIsProcessing(true);
                const data = await extractBillData(res[0].url);
                setExtractedData(data);
                setIsProcessing(false);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Review AI Extraction</CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing && <p className="animate-pulse">AI is reading the bill...</p>}
            {extractedData && (
              <div className="space-y-4">
                <p className="font-bold">Vendor: {extractedData.vendorName}</p>
                <ul className="text-sm space-y-1">
                  {extractedData.items.map((item: any, i: number) => (
                    <li key={i} className="border-b pb-1">
                      {item.name} - {item.quantity} {item.category} (@ ${item.price})
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Confirm & Update Stock</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}