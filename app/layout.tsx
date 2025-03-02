import type { Metadata } from "next";
import "./globals.css";
import { ToggleThemeProvider } from "./context/toggleTheme";


export const metadata: Metadata = {
  title: "Bitcoin chart",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased w-screen h-screen dark:bg-[#323232]">
        <ToggleThemeProvider>
          <div className="p-5">
            {children}
          </div>
        </ToggleThemeProvider>
      </body>
    </html>
  );
}
