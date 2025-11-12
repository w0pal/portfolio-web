import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
 variable: '--font-geist-sans',
 subsets: ['latin'],
 weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
 variable: '--font-geist-mono',
 subsets: ['latin'],
 weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
 title: "w0pal's Website",
 description: 'The personal website and blog of w0pal.',
 themeColor: [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
 ],
 viewport: {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <head>
    <meta name="theme-color" content="#1e293b" />
    <meta
     name="theme-color"
     media="(prefers-color-scheme: light)"
     content="#ffffff"
    />
    <meta
     name="theme-color"
     media="(prefers-color-scheme: dark)"
     content="#1e293b"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
     name="apple-mobile-web-app-status-bar-style"
     content="black-translucent"
    />
    <link rel="manifest" href="/manifest.json" />
   </head>
   <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    {children}
   </body>
  </html>
 );
}
