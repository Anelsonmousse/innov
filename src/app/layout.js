import "./globals.css";

export const metadata = {
  title: "Vplaza",
  description: "Your one-stop shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <body>{children}</body>
    </html>
  );
}
