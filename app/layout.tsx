import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Kilograms left until a whole credit',
  description: '2500 kg at 1000 per credit needs 500 more. 2000 needs 0. Not an oracle.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
