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
        // Fix for ts(2339)
        const err = result as { error?: string };
        toast.error(err.error || "Failed to install data.");
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
        <UploadDropzone
          endpoint="billUploader"
          onUploadBegin={() => setIsProcessing(true)}
          onClientUploadComplete={async (res) => {
            const data = await extractBillData(res[0].url);
            setExtractedData(data);
            setIsProcessing(false);
            toast.success("AI Extraction Complete!");
          }}
          onUploadError={(error) => {
            setIsProcessing(false);
            toast.error("Upload failed.");
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Items: {extractedData.vendorName}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ... item list mapping ... */}
            <Button onClick={handleInstall} disabled={isProcessing} className="w-full bg-green-600">
              {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
              Confirm & Update Inventory
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}