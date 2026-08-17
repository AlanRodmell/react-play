import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Bridge — From Ruby instincts to React confidence",
  description: "A practical, adaptive React and TypeScript course for Ruby developers working with forms, routing, React Query and production architecture.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
