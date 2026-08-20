import { useMemo, useState } from 'react';
import { ArrowUpRight, Boxes, ChevronDown, CircleCheck, CircleX, Search, Store, UsersRound } from 'lucide-react';
import { useListAdminProducts, useListVendors, type Product, type Vendor } from '@workspace/api-client-react';
import { ErrorState, LoadingState } from '@/components/states';

function StatusBadge({ published }: { published?: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${published === false ? 'bg-secondary text-muted-foreground' : 'bg-emerald-700/10 text-emerald-800'}`}><span className={`size-1.5 rounded-full ${published === false ? 'bg-muted-foreground' : 'bg-emerald-700'}`} />{published === false ? 'Private' : 'Published'}</span>;
}

export default function AdminPage() {
  const vendorsQuery = useListVendors();
  const productsQuery = useListAdminProducts();
  const vendors = vendorsQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const [search, setSearch] = useState('');
  const [vendorFilter, setVendorFilter] = useState('All ateliers');
  const filteredProducts = useMemo(() => products.filter((product) => {
    const q = search.toLowerCase();
    return (vendorFilter === 'All ateliers' || product.vendorName === vendorFilter) && `${product.name} ${product.sku} ${product.vendorName}`.toLowerCase().includes(q);
  }), [products, search, vendorFilter]);

  const counts = { published: products.filter((product) => product.isPublished !== false).length, private: products.filter((product) => product.isPublished === false).length };

  return <div className="animate-in fade-in duration-500" data-testid="page-admin">
    <div className="mb-9 flex flex-col justify-between gap-6 border-b border-border/70 pb-8 md:flex-row md:items-end"><div><p className="eyebrow mb-4 text-primary">Operations · 02</p><h1 className="font-display text-5xl leading-none tracking-[-0.045em]">Administration<span className="text-primary">.</span></h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">A clear view of atelier partners and every piece entrusted to the showroom.</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-700" />All systems operational</div></div>
    {(vendorsQuery.isLoading || productsQuery.isLoading) ? <LoadingState label="Loading administration" /> : vendorsQuery.isError || productsQuery.isError ? <ErrorState onRetry={() => { void vendorsQuery.refetch(); void productsQuery.refetch(); }} /> :
      <><div className="mb-9 grid gap-4 sm:grid-cols-3"><Metric icon={Boxes} label="Total pieces" value={products.length} detail={`${counts.published} published`} /><Metric icon={Store} label="Partner ateliers" value={vendors.length} detail="With active access" /><Metric icon={UsersRound} label="Private pieces" value={counts.private} detail="Awaiting release" /></div>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow text-primary">Inventory ledger</p><h2 className="mt-2 font-display text-2xl">All catalogue pieces</h2></div><div className="relative w-full md:w-64"><Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory" data-testid="input-admin-search" className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-secondary/45"><tr className="eyebrow text-muted-foreground"><th className="px-5 py-3 font-normal">Piece</th><th className="px-5 py-3 font-normal">Atelier</th><th className="px-5 py-3 font-normal">Material</th><th className="px-5 py-3 font-normal">Status</th><th className="px-5 py-3 font-normal" /></tr></thead><tbody className="divide-y divide-border">{filteredProducts.map((product) => <AdminRow key={product.id} product={product} />)}</tbody></table>{filteredProducts.length === 0 && <div className="px-5 py-14 text-center text-sm text-muted-foreground">No inventory matches that view.</div>}</div></section>
        <section className="h-fit rounded-2xl border border-border bg-card"><div className="border-b border-border p-5"><p className="eyebrow text-primary">Partner network</p><h2 className="mt-2 font-display text-2xl">Ateliers</h2></div><div className="p-3"><button type="button" onClick={() => setVendorFilter('All ateliers')} data-testid="button-filter-all-ateliers" className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs ${vendorFilter === 'All ateliers' ? 'bg-secondary font-bold text-foreground' : 'text-muted-foreground hover:bg-secondary/60'}`}><span>All ateliers</span><span className="font-mono-ui text-[10px]">{products.length}</span></button>{vendors.map((vendor) => <VendorRow key={vendor.id} vendor={vendor} active={vendorFilter === vendor.name} onClick={() => setVendorFilter(vendor.name)} />)}</div><div className="m-4 rounded-xl bg-sidebar p-4 text-sidebar-foreground"><p className="eyebrow text-sidebar-primary">Release cadence</p><p className="mt-3 font-display text-xl">Keep the edit<br />deliberate.</p><p className="mt-3 text-xs leading-5 text-sidebar-foreground/60">Only publish pieces that are ready for the partner floor.</p></div></section>
      </div></>}
  </div>;
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Boxes; label: string; value: number; detail: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="eyebrow text-muted-foreground">{label}</span><Icon className="size-4 text-primary" strokeWidth={1.5} /></div><p className="mt-5 font-display text-4xl" data-testid={`text-metric-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

function AdminRow({ product }: { product: Product }) {
  return <tr className="group transition-colors hover:bg-secondary/35" data-testid={`row-admin-product-${product.id}`}><td className="px-5 py-4"><p className="text-sm font-semibold">{product.name}</p><p className="mt-1 font-mono-ui text-[10px] tracking-widest text-muted-foreground">{product.sku}</p></td><td className="px-5 py-4 text-xs text-muted-foreground">{product.vendorName}</td><td className="px-5 py-4 text-xs text-muted-foreground">{product.material}</td><td className="px-5 py-4"><StatusBadge published={product.isPublished} /></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => window.alert(`${product.name} · ${product.sku}`)} aria-label={`View ${product.name}`} data-testid={`button-view-admin-product-${product.id}`} className="rounded-md p-2 text-muted-foreground opacity-50 transition-all hover:bg-secondary hover:text-primary group-hover:opacity-100"><ArrowUpRight className="size-4" /></button></td></tr>;
}

function VendorRow({ vendor, active, onClick }: { vendor: Vendor; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} data-testid={`button-filter-vendor-${vendor.id}`} className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${active ? 'bg-secondary' : 'hover:bg-secondary/60'}`}><span className="grid size-8 place-items-center rounded-full border border-border bg-background font-display text-sm text-primary">{vendor.name.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-foreground">{vendor.name}</span><span className="mt-1 block font-mono-ui text-[9px] uppercase tracking-widest text-muted-foreground">{vendor.code}</span></span><span className="flex items-center gap-1 text-[10px] text-muted-foreground">{vendor.productCount}<ChevronDown className={`size-3 transition-transform ${active ? 'rotate-180 text-primary' : ''}`} /></span></button>;
}