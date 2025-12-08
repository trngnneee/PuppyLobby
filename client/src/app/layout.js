import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "Puppy Lobby",
  description: "A cute social platform for puppy lovers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
