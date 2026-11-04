import { Caveat, Inter_Tight } from "next/font/google";

// Shared so every section loads the same font files once
export const handwriting = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-hand" });
export const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
