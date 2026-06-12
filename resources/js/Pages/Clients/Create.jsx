import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function Field({ label, error, required, children, hint }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
    );
}

const inputClass =
    'block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Nouveau client</h2>
                        <p className="mt-1 text-sm text-gray-500">Ajoutez un client à votre carnet</p>
                    </div>
                    <Link
                        href={route('clients.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        ← Retour
                    </Link>
                </div>
            }
        >
            <Head title="Nouveau client" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Field label="Nom complet" required error={errors.name}>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ex: Marie Dupont"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                            <Field label="Email" error={errors.email} hint="Optionnel — doit être unique">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="marie.dupont@example.com"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Téléphone" error={errors.phone}>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+33 6 12 34 56 78"
                                    className={inputClass}
                                />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Adresse" error={errors.address}>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="12 rue de la Paix"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                            <div className="sm:col-span-2">
                                <Field label="Ville" error={errors.city}>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Paris"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                            <Link
                                href={route('clients.index')}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement…' : 'Créer le client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
