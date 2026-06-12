import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function StatCard({ label, value, accent, icon, href }) {
    const accents = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        sky: 'bg-sky-50 text-sky-600',
    };
    const content = (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-500">{label}</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${accents[accent]}`}>
                    {icon}
                </div>
            </div>
            {href && (
                <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                    Voir les détails
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-1 h-3 w-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            )}
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}

function TypeBadge({ type }) {
    const isIn = type === 'in';
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isIn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
        >
            {isIn ? '+' : '−'}{isIn ? 'Entrée' : 'Sortie'}
        </span>
    );
}

export default function Dashboard({ auth, totalProducts, totalClients, outOfStock, lowStock, lastMovements = [] }) {
    const movements = Array.isArray(lastMovements) ? lastMovements : [];
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Bonjour, {auth.user.name.split(' ')[0]} 👋
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Voici un aperçu de votre activité</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Produits"
                            value={totalProducts}
                            accent="indigo"
                            href={route('products.index')}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Clients"
                            value={totalClients}
                            accent="sky"
                            href={route('clients.index')}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Stock faible"
                            value={lowStock}
                            accent="amber"
                            href={route('products.index')}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="En rupture"
                            value={outOfStock}
                            accent="rose"
                            href={route('products.index')}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Link
                            href={route('products.create')}
                            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Nouveau produit</div>
                                <div className="text-xs text-gray-500">Ajouter une référence au catalogue</div>
                            </div>
                        </Link>
                        <Link
                            href={route('clients.create')}
                            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Nouveau client</div>
                                <div className="text-xs text-gray-500">Ajouter un contact</div>
                            </div>
                        </Link>
                        <Link
                            href={route('stock-movements.index')}
                            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Mouvement de stock</div>
                                <div className="text-xs text-gray-500">Entrée ou sortie</div>
                            </div>
                        </Link>
                    </div>

                    {/* Last movements */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Derniers mouvements</h3>
                                <p className="text-xs text-gray-500">Les 10 dernières opérations de stock</p>
                            </div>
                            <Link
                                href={route('stock-movements.index')}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Tout voir →
                            </Link>
                        </div>
                        {movements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">Aucun mouvement enregistré pour le moment.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/30">
                                        <tr>
                                            <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
                                            <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                                            <th className="px-6 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Quantité</th>
                                            <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {movements.map((m) => (
                                            <tr key={m.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-3">
                                                    <div className="font-medium text-gray-900">{m.product?.name ?? '—'}</div>
                                                    {m.product?.reference && (
                                                        <span className="font-mono text-xs text-gray-500">{m.product.reference}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <TypeBadge type={m.type} />
                                                </td>
                                                <td className={`whitespace-nowrap px-6 py-3 text-right font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {m.type === 'in' ? '+' : '−'}{m.quantity}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                                                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
