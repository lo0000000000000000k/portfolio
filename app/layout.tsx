import type { Metadata } from 'next';
import { Syne, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Harshit Malik — AI/ML Developer Portfolio',
  description:
    'B.Tech CSE (AI & ML) undergraduate specializing in Machine Learning, Computer Vision, and Network Security. Building intelligent systems with Python, TensorFlow, and C++.',
  keywords: ['Harshit Malik', 'AI Developer', 'ML Engineer', 'Portfolio', 'Machine Learning', 'Python', 'TensorFlow'],
  authors: [{ name: 'Harshit Malik', url: 'https://github.com/harshitmalik' }],
  openGraph: {
    title: 'Harshit Malik — AI/ML Developer Portfolio',
    description: 'B.Tech CSE (AI & ML) undergraduate building intelligent systems.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
