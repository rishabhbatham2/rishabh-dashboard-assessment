'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, Search, Table2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { Input } from '../ui/input';
import { ThemeToggleButton } from '../theme-toggle-button';
import { useLayout } from '@/context/layout-context';


const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/table', label: 'Table', icon: Table2 }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { headerActions } = useLayout();

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <div className="flex h-12 items-center justify-center mb-4"></div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={{children: item.label}} size="sm" className="font-normal">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{children: "Log Out"}} size="sm" className="font-normal">
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                 <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="w-64 pl-9 bg-muted border-none rounded-full" />
                </div>
            </div>
            <div className="flex items-center gap-4">
              {headerActions}
              <ThemeToggleButton />
              <UserNav />
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
