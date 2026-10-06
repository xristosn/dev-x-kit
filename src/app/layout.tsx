import { CookieDisclaimer } from '@/components/cookie-disclaimer';
import { Providers } from '@/components/providers';
import { SITE_URL } from '@/lib/constants';
import { OPEN_GRAPH_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo-metadata';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', preload: false });

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  preload: false,
});

const defaultSocialTitle = 'Free Online Developer Tools | Dev X Kit';

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Christos Niaskos', url: 'https://github.com/xristosn' }],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: defaultSocialTitle,
    description: SITE_DESCRIPTION,
    url: SITE_URL.toString(),
    images: [
      {
        url: OPEN_GRAPH_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - free online developer tools`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSocialTitle,
    description: SITE_DESCRIPTION,
    images: [OPEN_GRAPH_IMAGE_PATH],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-mono', jetbrainsMono.variable, 'font-sans', inter.variable)}
    >
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}

          <CookieDisclaimer />
        </Providers>
      </body>

      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}
