import { Inter, Outfit, Sora } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/public/PublicShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "OMKAR CREATIONS | Mobile Editor • 4K Visuals • Mass Edits",
  description:
    "Portfolio of OMKAR CREATIONS — Turning Frames into Art. Mobile editing, 4K visuals, mass edits, and downloadable project files. PC-Level work on a smartphone.",
  keywords: [
    "omkar creations",
    "mobile editing",
    "4k visuals",
    "mass edits",
    "instagram reels",
    "project files",
    "alight motion",
    "video editing",
  ],
  openGraph: {
    title: "OMKAR CREATIONS | Turning Frames into Art",
    description:
      "Mobile Editor • 4K Visuals • Mass Edits • PC-Level Work on a Smartphone",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${sora.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-text font-body antialiased grain">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
