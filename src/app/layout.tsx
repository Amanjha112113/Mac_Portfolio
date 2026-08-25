import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aman Jha — AI/ML Portfolio',
  description:
    'Interactive macOS-inspired portfolio for Aman Jha — AI/ML engineer specializing in voice AI, computer vision, and agentic systems.',
  keywords: [
    'Aman Jha',
    'AI',
    'ML',
    'Voice AI',
    'Computer Vision',
    'Agentic AI',
    'Portfolio',
    'WebRTC',
  ],
  authors: [{ name: 'Aman Jha' }],
  openGraph: {
    title: 'Aman Jha — AI/ML Portfolio',
    description:
      'Interactive macOS-inspired portfolio featuring a realtime voice AI assistant.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d0f14" />
      </head>
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
