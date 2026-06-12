import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

function StockBadge({ status }) {
    const styles = {
        'disponible': 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
        'stock faible': 'bg-amber-100 text-amber-700 ring-amber-600/20',
        'en rupture': 'bg-rose-100 text-rose-700 ring-rose-600/20',
    };
    const dots = {
        'disponible': 'bg-emerald-500',
        'stock faible': 'bg-amber-500',
        'en rupture': 'bg-rose-500',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status] ?? 'bg-gray-100 text-gray-700 ring-gray-600/20'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dots[status] ?? 'bg-gray-500'}`}></span>
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Aucun produit</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier produit.</p>
            <Link
                href={route('products.create')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
                + Nouveau produit
            </Link>
        </div>
    );
}

export default function Index({ auth, products, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'tous');

    const deleteProduct = (product) => {
        if (confirm(`Supprimer "${product.name}" ?`)) {
            router.delete(route('products.destroy', product.id), { preserveScroll: true });
        }
    };

    // Normalise : on accepte soit un tableau brut, soit la pagination Inertia
    const list = Array.isArray(products) ? products : (products?.data ?? []);
    const links = products?.links ?? [];

    const filtered = useMemo(() => {
        return list.filter((product) => {
            const matchSearch =
                !search ||
                product.name?.toLowerCase().includes(search.toLowerCase()) ||
                product.reference?.toLowerCase().includes(search.toLowerCase()) ||
                product.marque?.toLowerCase().includes(search.toLowerCase());
            const status = product.stock_status ?? product.get_stock_status;
            const matchStatus = statusFilter === 'tous' || status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [list, search, statusFilter]);

    const stats = useMemo(() => {
        return list.reduce(
            (acc, p) => {
                const status = p.stock_status ?? 'disponible';
                acc.total += 1;
                acc.totalValue += Number(p.price ?? 0) * Number(p.stock_quantity ?? 0);
                if (status === 'disponible') acc.available += 1;
                if (status === 'stock faible') acc.low += 1;
                if (status === 'en rupture') acc.out += 1;
                return acc;
            },
            { total: 0, available: 0, low: 0, out: 0, totalValue: 0 }
        );
    }, [list]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Produits</h2>
                        <p className="mt-1 text-sm text-gray-500">Gérez votre catalogue et votre inventaire</p>
                    </div>
                    <Link
                        href={route('products.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                        Nouveau produit
                    </Link>
                </div>
            }
        >
            <Head title="Produits" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stat cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Total produits</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Disponibles</div>
                            <div className="mt-2 text-3xl font-bold text-emerald-600">{stats.available}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Stock faible</div>
                            <div className="mt-2 text-3xl font-bold text-amber-600">{stats.low}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Valeur du stock</div>
                            <div className="mt-2 text-3xl font-bold text-indigo-600">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalValue)}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher (nom, référence, marque)…"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                            {['tous', 'disponible', 'stock faible', 'en rupture'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                        statusFilter === s
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {s === 'tous' ? 'Tous' : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        {list.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Référence</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Marque</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Prix</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">État</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                                                    Aucun produit ne correspond à votre recherche.
                                                </td>
                                            </tr>
                                        )}
                                        {filtered.map((product) => {
                                            const status = product.stock_status ?? 'disponible';
                                            return (
                                                <tr key={product.id} className="transition hover:bg-gray-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        {product.description && (
                                                            <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">{product.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                                                            {product.reference}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{product.marque || <span className="text-gray-400">—</span>}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price ?? 0)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="font-medium text-gray-900">{product.stock_quantity}</div>
                                                        <div className="text-xs text-gray-500">min. {product.stock_minimum}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StockBadge status={status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-1">
                                                            <Link
                                                                href={route('products.show', product.id)}
                                                                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600"
                                                                title="Voir"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                </svg>
                                                            </Link>
                                                            <Link
                                                                href={route('products.edit', product.id)}
                                                                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-amber-600"
                                                                title="Modifier"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                onClick={() => deleteProduct(product)}
                                                                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600"
                                                                title="Supprimer"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination (si Inertia) */}
                        {links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Page {products.current_page} sur {products.last_page}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-gray-200'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
