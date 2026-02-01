import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
    title: "ComplaintPortal - Grievance Redressal System",
    description: "Digital platform for citizen complaint management in Ambarnath, Maharashtra",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <LanguageProvider>
                    {children}
                    <Toaster position="top-right" richColors />
                </LanguageProvider>
            </body>
        </html>
    );
}
