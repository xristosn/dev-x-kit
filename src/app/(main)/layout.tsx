import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';

export default async function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-background">
      <AppHeader />

      <main className="w-full min-h-screen overflow-y-auto overflow-x-hidden relative flex flex-col items-stretch">
        {children}
      </main>

      <Footer />
    </div>
  );
}
