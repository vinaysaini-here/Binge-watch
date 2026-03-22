import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { getCurrentUser } from "@/lib/session";

const headingFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://binge-watch.example"),
  title: {
    default: "BingeWatch | External Video Streaming Platform",
    template: "%s | BingeWatch",
  },
  description:
    "A premium video discovery platform for YouTube and Vimeo links with custom controls, dashboards, and rich creator profiles.",
  keywords: [
    "video streaming platform",
    "youtube embed platform",
    "vimeo embed app",
    "video dashboard",
    "nextjs streaming app",
  ],
};

export default async function RootLayout({ children }) {
  const initialUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} scrollbar-thin`}
    >
      <body className="min-h-screen">
        <AppProvider initialUser={initialUser}>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
