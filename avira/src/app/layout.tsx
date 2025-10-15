import type { Metadata } from "next";
import { Providers } from "./components/Providers";
import { Geist, Geist_Mono } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import getCurrentUser from "./actions/getCurrentUser";
// import NavBar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avira",
  description: "Avira your Go To Travel App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
          {/* <NavBar currentUser={currentUser} /> */}
        </Providers>
        {/* <Providers currentUser={currentUser} session={session}>
          {children}
        </Providers> */}
      </body>
    </html>
  );
}
