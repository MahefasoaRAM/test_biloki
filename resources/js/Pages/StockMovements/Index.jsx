import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

function TypeBadge({ type }) {
    const isIn = type === 'in';
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                isIn
                    ? 'bg-emerald-100 text-emerald-700 ring-emerald-600/20'
                    : 'bg-rose-100 text-rose-700 ring-rose-600/20'
            }`}
        >
            {isIn ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
            )}
            {isIn ? 'Entrée' : 'Sortie'}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Aucun mouvement</h3>
            <p className="mt-1 text-sm text-gray-500">Enregistrez votre première entrée ou sortie de stock.</p>
        </div>
    );
}

export default function Index({ auth, movements, products = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? 'tous');
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        type: 'in',
        quantity: 1,
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stock-movements.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const list = Array.isArray(movements) ? movements : (movements?.data ?? []);
    const links = movements?.links ?? [];

    const filtered = useMemo(() => {
        return list.filter((m) => {
            const matchSearch =
                !search ||
                m.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.product?.reference?.toLowerCase().includes(search.toLowerCase()) ||
                m.note?.toLowerCase().includes(search.toLowerCase());
            const matchType = typeFilter === 'tous' || m.type === typeFilter;
            return matchSearch && matchType;
        });
    }, [list, search, typeFilter]);

    const selectedProduct = products.find((p) => p.id == data.product_id);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Mouvements de stock</h2>
                        <p className="mt-1 text-sm text-gray-500">Suivi des entrées et sorties d'inventaire</p>
                    </div>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                        Nouveau mouvement
                    </button>
                </div>
            }
        >
            <Head title="Mouvements de stock" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Total mouvements</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total ?? list.length}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Entrées</div>
                            <div className="mt-2 text-3xl font-bold text-emerald-600">{stats.in ?? 0}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Sorties</div>
                            <div className="mt-2 text-3xl font-bold text-rose-600">{stats.out ?? 0}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Alertes stock</div>
                            <div className="mt-2 text-3xl font-bold text-amber-600">
                                {(stats.low_stock ?? 0) + (stats.out_of_stock ?? 0)}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {stats.out_of_stock ?? 0} en rupture · {stats.low_stock ?? 0} faibles
                            </div>
                        </div>
                    </div>

                    {/* Form (collapsible) */}
                    {showForm && (
                        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                                <h3 className="text-base font-semibold text-gray-900">Enregistrer un mouvement</h3>
                            </div>
                            <form onSubmit={submit} className="p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="lg:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Produit <span className="text-rose-500">*</span></label>
                                        <select
                                            value={data.product_id}
                                            onChange={(e) => setData('product_id', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option value="">— Choisir un produit —</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.reference}) — stock: {p.stock_quantity}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && <p className="mt-1 text-xs text-rose-600">{errors.product_id}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Type <span className="text-rose-500">*</span></label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'in')}
                                                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                                    data.type === 'in'
                                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                + Entrée
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'out')}
                                                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                                    data.type === 'out'
                                                        ? 'border-rose-300 bg-rose-50 text-rose-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                − Sortie
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Quantité <span className="text-rose-500">*</span></label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                        {errors.quantity && <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>}
                                        {selectedProduct && data.type === 'out' && (
                                            <p className="mt-1 text-xs text-gray-500">Stock disponible : {selectedProduct.stock_quantity}</p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Note</label>
                                        <input
                                            type="text"
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            placeholder="Ex: Réception fournisseur, vente client n°42…"
                                            className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Enregistrement…' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

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
                                placeholder="Rechercher (produit, référence, note)…"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                            {[
                                { value: 'tous', label: 'Tous' },
                                { value: 'in', label: 'Entrées' },
                                { value: 'out', label: 'Sorties' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setTypeFilter(opt.value)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                        typeFilter === opt.value
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        {list.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Quantité</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                                    Aucun mouvement ne correspond à votre recherche.
                                                </td>
                                            </tr>
                                        )}
                                        {filtered.map((m) => (
                                            <tr key={m.id} className="transition hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    <div>{new Date(m.created_at).toLocaleDateString('fr-FR')}</div>
                                                    <div className="text-xs text-gray-400">{new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{m.product?.name ?? '—'}</div>
                                                    {m.product?.reference && (
                                                        <span className="mt-0.5 inline-flex rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600">
                                                            {m.product.reference}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <TypeBadge type={m.type} />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <span className={`text-base font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {m.type === 'in' ? '+' : '−'}{m.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {m.note ? m.note : <span className="text-gray-400">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Page {movements.current_page} sur {movements.last_page}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                            disabled={!link.url}
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
