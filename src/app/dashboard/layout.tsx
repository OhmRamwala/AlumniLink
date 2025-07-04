import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col md:pl-[16rem]">
          <Header />
          <main className="flex-1 p-4 sm:p-6 bg-background max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
