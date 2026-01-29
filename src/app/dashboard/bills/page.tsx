"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { extractBillData } from "@/actions/bill-ai"; // Pointing to the new folder location
import { toast } from "sonner";

export default function BillsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">iLabs Bill Processing</h1>
      
      {!extractedData ? (
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
              console.log("🤖 Sending URL to Gemini:", url);
              const data = await extractBillData(url);
              console.log("📊 Gemini returned:", data);
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
      ) : (
        <div>
           {/* Your existing Table/Confirm UI goes here */}
           <pre>{JSON.stringify(extractedData, null, 2)}</pre>
           <button onClick={() => setExtractedData(null)}>Clear</button>
        </div>
      )}
    </div>
  );
}