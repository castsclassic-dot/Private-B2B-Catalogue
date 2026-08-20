import { useEffect, useState } from 'react';
import { ArrowRight, Gem, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (user) setLocation('/catalogue'); }, [setLocation, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);
    if (result.error) setError(result.error);
    else setLocation('/catalogue');
  }

  return (
    <div className="texture grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(420px,0.9fr)_1.1fr]" data-testid="page-login">
      <section className="relative hidden overflow-hidden bg-sidebar px-12 py-12 text-sidebar-foreground lg:flex lg:flex-col">
        <div className="absolute -right-36 top-24 size-[460px] rounded-full border border-sidebar-primary/20" /><div className="absolute -right-24 top-36 size-[340px] rounded-full border border-sidebar-primary/15" /><div className="absolute -right-10 top-48 size-[220px] rounded-full border border-sidebar-primary/10" />
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full border border-sidebar-primary/50 text-sidebar-primary"><Gem className="size-4" strokeWidth={1.4} /></span><div><p className="font-display text-xl">Aurum</p><p className="eyebrow text-sidebar-foreground/45">Private showroom</p></div></div>
        <div className="relative mt-auto max-w-md pb-8"><p className="eyebrow mb-5 text-sidebar-primary">For the trade, by invitation</p><h1 className="font-display text-5xl leading-[1.04] tracking-[-0.03em] text-sidebar-foreground">A considered view of exceptional jewellery.</h1><p className="mt-7 max-w-sm text-sm leading-7 text-sidebar-foreground/60">A private catalogue for buyers and makers. See the latest pieces, their provenance, and the people behind them.</p><div className="mt-12 flex items-center gap-3 text-xs text-sidebar-foreground/50"><ShieldCheck className="size-4 text-sidebar-primary" strokeWidth={1.5} /> Approved partner access only</div></div>
        <div className="absolute bottom-12 right-14 font-display text-8xl text-sidebar-primary/10">A</div>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12"><div className="w-full max-w-[420px]">
        <div className="mb-14 lg:hidden"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-sidebar text-sidebar-primary"><Gem className="size-4" strokeWidth={1.4} /></span><div><p className="font-display text-xl">Aurum</p><p className="eyebrow text-muted-foreground">Private showroom</p></div></div></div>
        <div className="mb-10"><p className="eyebrow mb-4 text-primary">Welcome back</p><h2 className="font-display text-4xl leading-tight tracking-[-0.03em]">Enter the showroom.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Use the email address associated with your trade account.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.11em] text-foreground/70">Work email</span><input required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@atelier.com" data-testid="input-email" className="h-12 w-full rounded-lg border border-input bg-card px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" /></label>
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.11em] text-foreground/70">Password</span><div className="relative"><input required autoComplete="current-password" minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your private password" data-testid="input-password" className="h-12 w-full rounded-lg border border-input bg-card px-4 pr-11 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10" /><LockKeyhole className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" /></div></label>
          {error && <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-login-error">{error}</p>}
          <button type="submit" disabled={isSubmitting} data-testid="button-submit-login" className="group flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Checking access…' : 'Continue to catalogue'}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></button>
        </form>
        <div className="mt-10 border-t border-border pt-5 text-center"><p className="text-xs leading-5 text-muted-foreground">Access is provisioned by your Aurum representative.<br />Need help? Contact your account lead.</p></div>
      </div></section>
    </div>
  );
}