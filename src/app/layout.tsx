import "./globals.css";

import { ClerkProvider, auth } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/providers/modal-providers";
import ReactQueryProvider from "@/providers/react-query-provider";
import prisma from "@/lib/prismaDB";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "Ecommmerce Admin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <ModalProvider />
            {children}
          </ReactQueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
