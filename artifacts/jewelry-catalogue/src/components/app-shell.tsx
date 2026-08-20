import { useState } from 'react';
import { Building2, ChevronDown, Gem, LayoutDashboard, LogOut, Menu, ShieldCheck, Store, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

function initials(email?: string) {
  if (!email) return 'PC';
  return email.split('@')[0].slice(0, 2).toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const links = [
    { href: '/catalogue', label: 'Catalogue', icon: Gem },
    { href: '/vendor', label: 'Vendor workspace', icon: Store },
    ...(isAdmin ? [{ href: '/admin', label: 'Administration', icon: ShieldCheck }] : []),
  ];

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
  }

  return (
    <div className="texture flex min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} data-testid="sidebar">
        <div className="flex items-center justify-between px-3">
          <Link href="/catalogue" className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid size-9 place-items-center rounded-full border border-sidebar-primary/50 text-sidebar-primary"><Gem className="size-4" strokeWidth={1.4} /></span>
            <span>
              <span className="block font-display text-[19px] leading-none text-sidebar-foreground">Aurum</span>
              <span className="eyebrow mt-1 block text-sidebar-foreground/50">Private showroom</span>
            </span>
          </Link>
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-md p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent md:hidden" aria-label="Close menu" data-testid="button-close-menu"><X className="size-4" /></button>
        </div>

        <div className="mt-14 px-3">
          <p className="eyebrow mb-4 text-sidebar-foreground/40">Workspace</p>
          <nav className="space-y-1" aria-label="Primary navigation">
            {links.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`}>
                <Icon className={`size-[17px] transition-transform duration-200 group-hover:scale-105 ${active ? 'text-sidebar-primary' : ''}`} strokeWidth={1.6} />
                <span>{label}</span>
                {active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
              </Link>;
            })}
          </nav>
        </div>

        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/45 p-4">
          <div className="mb-3 flex items-center gap-2 text-sidebar-foreground/70"><Building2 className="size-3.5 text-sidebar-primary" /><span className="eyebrow">Access tier</span></div>
          <p className="text-xs leading-5 text-sidebar-foreground/60">Curated inventory for approved trade partners.</p>
          <div className="mt-4 h-px bg-sidebar-border" />
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono-ui uppercase tracking-widest text-sidebar-foreground/40"><span>Encrypted</span><span className="text-sidebar-primary">Active</span></div>
        </div>

        <div className="mt-5 flex items-center gap-3 px-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary font-mono-ui text-xs font-bold text-sidebar-primary-foreground" data-testid="avatar-user">{initials(user?.email)}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-sidebar-foreground" data-testid="text-user-email">{user?.email ?? 'Trade partner'}</p><p className="mt-0.5 text-[10px] uppercase tracking-widest text-sidebar-foreground/40">{isAdmin ? 'Administrator' : 'Vendor access'}</p></div>
          <button type="button" onClick={handleSignOut} aria-label="Sign out" data-testid="button-sign-out" className="rounded-md p-1.5 text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-primary"><LogOut className="size-4" /></button>
        </div>
      </aside>
      {mobileOpen && <button type="button" aria-label="Close navigation" data-testid="button-mobile-overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-sidebar/40 backdrop-blur-sm md:hidden" />}
      <main className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-border/70 px-5 md:px-10">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" data-testid="button-open-menu" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"><Menu className="size-5" /></button>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span className="size-1.5 rounded-full bg-emerald-700" />Private partner network <span className="text-border">/</span> AW {new Date().getFullYear()}</div>
          <div className="ml-auto flex items-center gap-4"><span className="hidden text-right text-xs text-muted-foreground sm:block"><span className="block font-semibold text-foreground">{isAdmin ? 'Operations desk' : 'Trade workspace'}</span><span className="text-[10px]">London · Paris · New York</span></span><ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" /></div>
        </header>
        <div className="px-5 py-8 md:px-10 md:py-10 lg:px-14">{children}</div>
      </main>
    </div>
  );
}