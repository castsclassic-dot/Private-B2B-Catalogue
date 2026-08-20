import { ArrowLeft, Gem } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return <div className="texture flex min-h-[100dvh] items-center justify-center bg-background px-6 text-center" data-testid="page-not-found">
    <div><Gem className="mx-auto size-9 text-primary" strokeWidth={1.2} /><p className="eyebrow mt-7 text-primary">A quiet corner</p><h1 className="mt-3 font-display text-5xl tracking-[-0.04em]">Page not found.</h1><p className="mt-4 text-sm text-muted-foreground">That address does not belong to the showroom.</p><Link href="/catalogue" data-testid="link-not-found-catalogue" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Return to catalogue</Link></div>
  </div>;
}
