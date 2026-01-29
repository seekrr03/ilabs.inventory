import { Toaster } from "@/components/ui/sonner"; // Use the shadcn path
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        {/* The Toaster must be outside the main content but inside the body */}
        <Toaster /> 
      </body>
    </html>
  );
}