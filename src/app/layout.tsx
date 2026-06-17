import type { Metadata, Viewport } from 'next';
import './globals.css';
import faviconSvg from '@/assets/images/favicon.svg';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthStoreProvider } from '@/providers/auth-store';
import { MasterDataStoreProvider } from '@/providers/master-data-store';

const siteName = 'ForgeOS — Manufacturing ERP';
const siteDescription = 'Premium industrial executive command center for manufacturing operations';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8FAFC',
};

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: '%s · ForgeOS',
  },
  description: siteDescription,
  icons: {
    icon: { url: faviconSvg.src, type: 'image/svg+xml' },
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.setAttribute('data-theme','light');try{localStorage.setItem('forgeos-theme','light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans">
        <AuthStoreProvider>
          <MasterDataStoreProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </MasterDataStoreProvider>
        </AuthStoreProvider>
      </body>
    </html>
  );
}
