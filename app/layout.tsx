import { Inter, Roboto } from "next/font/google";
import type { Metadata } from "next";
import { classNames } from "@/lib/helpers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proffer Aid International Foundation | Racing to save lives",
  description: "Racing to save lives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(roboto.className, "relative")}>
        <Navbar />
        <main className="flex flex-col min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
