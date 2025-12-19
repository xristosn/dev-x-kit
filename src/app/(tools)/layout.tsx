import { Header } from '@/components/header';
import { AppSidebar } from '@/components/sidebar';
import { NAVIGATION } from '@/lib/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const pathname = headerList.get('x-current-path');
  const navigationItem = NAVIGATION.getItemByPath(pathname || '');

  return {
    title: navigationItem?.fullName || navigationItem?.label || 'Dev X Kit',
    description: navigationItem?.summary || '',
  };
}

export default async function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />

      <main className="w-screen min-h-screen overflow-y-auto overflow-x-hidden relative flex flex-col items-stretch">
        <Header />

        {children}
      </main>
    </>
  );
}
