import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function InfoRow({ label, value, isLink, href }) {
    return (
        <div className="flex items-start justify-between border-b border-gray-100 py-3 last:border-0">
            <div className="text-sm font-medium text-gray-500">{label}</div>
            <div className="text-right text-sm text-gray-900">
                {value ? (
                    isLink ? (
                        <a href={href} className="text-indigo-600 hover:underline">{value}</a>
                    ) : (
                        value
                    )
                ) : (
                    <span className="text-gray-400">—</span>
                )}
            </div>
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
    return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {initials || '?'}
        </div>
    );
}

export default function Show({ auth, client }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Fiche client</h2>
                        <p className="mt-1 text-sm text-gray-500">Détails et coordonnées</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('clients.edit', client.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Modifier
                        </Link>
                        <Link
                            href={route('clients.index')}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={client.name} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col items-center gap-4 border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white p-8 sm:flex-row sm:items-center">
                            <ClientAvatar name={client.name} />
                            <div className="text-center sm:text-left">
                                <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                                {client.email && (
                                    <p className="mt-1 text-sm text-gray-600">{client.email}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    Client depuis le {new Date(client.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <InfoRow label="Email" value={client.email} isLink href={`mailto:${client.email}`} />
                            <InfoRow label="Téléphone" value={client.phone} isLink href={`tel:${client.phone}`} />
                            <InfoRow label="Adresse" value={client.address} />
                            <InfoRow label="Ville" value={client.city} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
