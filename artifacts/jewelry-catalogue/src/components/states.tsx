import { AlertCircle, Gem, LoaderCircle, SearchX } from 'lucide-react';

export function LoadingState({ label = 'Loading catalogue' }: { label?: string }) {
  return (
    <div className="space-y-5" data-testid="state-loading">
      <div className="h-4 w-36 animate-pulse rounded bg-secondary" />
      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-44 animate-pulse bg-secondary/70" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}

export function ErrorState({ onRetry, label = 'The catalogue could not be loaded.' }: { onRetry?: () => void; label?: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 text-center" data-testid="state-error">
      <AlertCircle className="mb-4 size-7 text-primary" strokeWidth={1.5} />
      <h3 className="font-display text-2xl text-foreground">A quiet pause</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{label}</p>
      {onRetry && <button type="button" onClick={onRetry} data-testid="button-retry" className="mt-5 rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Try again</button>}
    </div>
  );
}

export function EmptyState({ searchTerm }: { searchTerm?: string }) {
  const filtered = Boolean(searchTerm);
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 text-center" data-testid="state-empty">
      {filtered ? <SearchX className="mb-4 size-8 text-primary" strokeWidth={1.5} /> : <Gem className="mb-4 size-8 text-accent" strokeWidth={1.5} />}
      <h3 className="font-display text-2xl text-foreground">{filtered ? 'Nothing matched that search' : 'The showroom is being arranged'}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{filtered ? 'Try a different name, material, or SKU.' : 'Published pieces will appear here as vendors release them.'}</p>
    </div>
  );
}

export function InlineLoading({ label = 'Loading' }: { label?: string }) {
  return <span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle className="size-3.5 animate-spin" />{label}</span>;
}