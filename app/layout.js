"use client"
import { Geist, Geist_Mono } from "next/font/google";
import useSocket from './socket.js'
import localFont from 'next/font/local';
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clash = localFont({
  src: './assets/fonts/Clash_Regular.otf',
  variable:'--font-clash',
  weight: '400',
  style: 'normal',
})

export default function RootLayout({ children }) {

  const {init, del, socket} = useSocket();
  useEffect(() => {

    init();
    console.log("from layout : ", socket)
    return () =>{
      del();
    }
  }, [])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${clash.variable} antialiased`}
      >
        <SessionProvider>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
