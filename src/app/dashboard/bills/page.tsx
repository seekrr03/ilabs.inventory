"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { extractBillData } from "@/actions/bill-ai";
import { toast } from "sonner";

export default function BillsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">iLabs Bill Processing (Debug Mode)</h1>
      
      {!extractedData ? (
        <UploadDropzone
          endpoint="billUploader"
          onUploadBegin={() => {
            console.log("🚀 Upload starting...");
            setIsProcessing(true);
          }}
          onClientUploadComplete={async (res) => {
            console.log("✅ Upload Finished! Response:", res);
            const url = res[0].url;
            console.log("📂 File URL:", url);
            
            try {
              console.log("🤖 Calling Gemini AI...");
              const data = await extractBillData(url);
              console.log("📊 Gemini Result:", data);
              setExtractedData(data);
              toast.success("AI Extraction Complete!");
            } catch (error) {
              console.error("❌ AI Error:", error);
              toast.error("AI failed to read bill.");
            } finally {
              setIsProcessing(false);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("⚠️ UploadThing Error:", error.message);
            setIsProcessing(false);
            toast.error(`Upload Error: ${error.message}`);
          }}
        />
      ) : (
        <div>
          <h2>Data Found!</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}

      {isProcessing && <p className="mt-4 animate-pulse">Checking console for logs...</p>}
    </div>
  );
}