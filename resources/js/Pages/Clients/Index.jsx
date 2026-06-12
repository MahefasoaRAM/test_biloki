import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Aucun client</h3>
            <p className="mt-1 text-sm text-gray-500">Ajoutez votre premier client pour commencer.</p>
            <Link
                href={route('clients.create')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
                + Nouveau client
            </Link>
        </div>
    );
}

function ClientAvatar({ name }) {
    const initials = (name || '?')
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
    const colors = [
        'bg-indigo-100 text-indigo-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
        'bg-sky-100 text-sky-700',
        'bg-purple-100 text-purple-700',
    ];
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
    return (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}>
            {initials || '?'}
        </div>
    );
}

export default function Index({ auth, clients }) {
    const [search, setSearch] = useState('');

    const deleteClient = (client) => {
        if (confirm(`Supprimer le client "${client.name}" ?`)) {
            router.delete(route('clients.destroy', client.id), { preserveScroll: true });
        }
    };

    const list = Array.isArray(clients) ? clients : (clients?.data ?? []);
    const links = clients?.links ?? [];

    const filtered = useMemo(() => {
        if (!search) return list;
        const s = search.toLowerCase();
        return list.filter((c) =>
            c.name?.toLowerCase().includes(s) ||
            c.email?.toLowerCase().includes(s) ||
            c.city?.toLowerCase().includes(s) ||
            c.phone?.toLowerCase().includes(s)
        );
    }, [list, search]);

    const cities = useMemo(() => {
        return [...new Set(list.map((c) => c.city).filter(Boolean))];
    }, [list]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Clients</h2>
                        <p className="mt-1 text-sm text-gray-500">Votre carnet de contacts</p>
                    </div>
                    <Link
                        href={route('clients.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                        Nouveau client
                    </Link>
                </div>
            }
        >
            <Head title="Clients" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Total clients</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{list.length}</div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Avec email</div>
                            <div className="mt-2 text-3xl font-bold text-indigo-600">
                                {list.filter((c) => c.email).length}
                            </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Villes</div>
                            <div className="mt-2 text-3xl font-bold text-emerald-600">{cities.length}</div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un client (nom, email, ville, téléphone)…"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
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
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Client</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ville</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                                                    Aucun client ne correspond à votre recherche.
                                                </td>
                                            </tr>
                                        )}
                                        {filtered.map((client) => (
                                            <tr key={client.id} className="transition hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <ClientAvatar name={client.name} />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{client.name}</div>
                                                            {client.address && (
                                                                <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">{client.address}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {client.email && (
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 text-gray-400">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                                            </svg>
                                                            <a href={`mailto:${client.email}`} className="hover:text-indigo-600">{client.email}</a>
                                                        </div>
                                                    )}
                                                    {client.phone && (
                                                        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 text-gray-400">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                            </svg>
                                                            <a href={`tel:${client.phone}`} className="hover:text-indigo-600">{client.phone}</a>
                                                        </div>
                                                    )}
                                                    {!client.email && !client.phone && (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {client.city ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                            </svg>
                                                            {client.city}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1">
                                                        <Link
                                                            href={route('clients.show', client.id)}
                                                            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600"
                                                            title="Voir"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={route('clients.edit', client.id)}
                                                            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-amber-600"
                                                            title="Modifier"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteClient(client)}
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Page {clients.current_page} sur {clients.last_page}
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
