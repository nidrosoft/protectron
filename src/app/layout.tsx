import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { ToastProvider } from "@/components/base/toast/toast";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Protectron — EU AI Act Compliance Platform",
    description: "Simplify EU AI Act compliance with AI-powered documentation, risk assessments, and compliance tracking for your AI systems.",
};

export const viewport: Viewport = {
    themeColor: "#7f56d9",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
            <body className={cx(inter.variable, "h-full overflow-hidden bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>
                        <ToastProvider>{children}</ToastProvider>
                    </Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
