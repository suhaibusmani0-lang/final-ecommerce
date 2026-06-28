import type { Metadata } from "next";
import AutoTitle from "@/components/AutoTitle";
import { Playfair_Display, Raleway } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Providers from "@/components/providers/ThemeProvider";
import GlobalProvider from "@/components/application/GlobalProvider";

export const metadata: Metadata = {
  title: {
    default: "Shop Store",
    template: "%s |Cosmopolitan Xccessories",
  },
  description: "Cosmopolitan Xccessories",
  icons: {
    icon: "/assets/images/favicon.png",
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${raleway.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <AutoTitle />

        <GlobalProvider>
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </GlobalProvider>
      </body>
    </html>
  );
}