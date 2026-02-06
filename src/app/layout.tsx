import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Quizz - The Ultimate Quiz Battle Platform',
  description: 'Challenge your friends, climb the leaderboards, and prove you\'re the smartest player!',
  keywords: ['quiz', 'trivia', 'game', 'battle', 'leaderboard'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
