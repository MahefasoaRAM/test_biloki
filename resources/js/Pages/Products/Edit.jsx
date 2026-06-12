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

export default function Edit({ auth, product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        reference: product.reference || '',
        marque: product.marque || '',
        description: product.description || '',
        price: product.price ?? '',
        active: Boolean(product.active),
        stock_quantity: product.stock_quantity ?? 0,
        stock_minimum: product.stock_minimum ?? 0,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">Modifier le produit</h2>
                        <p className="mt-1 font-mono text-sm text-gray-500">{product.reference}</p>
                    </div>
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        ← Retour
                    </Link>
                </div>
            }
        >
            <Head title={`Modifier ${product.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Field label="Nom" required error={errors.name}>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                                </Field>
                            </div>
                            <Field label="Référence" required error={errors.reference}>
                                <input type="text" value={data.reference} onChange={(e) => setData('reference', e.target.value)} className={`${inputClass} font-mono`} />
                            </Field>
                            <Field label="Marque" error={errors.marque}>
                                <input type="text" value={data.marque} onChange={(e) => setData('marque', e.target.value)} className={inputClass} />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Description" error={errors.description}>
                                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className={inputClass} />
                                </Field>
                            </div>
                            <Field label="Prix (€)" required error={errors.price}>
                                <input type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputClass} />
                            </Field>
                            <div className="flex items-end">
                                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={data.active}
                                        onChange={(e) => setData('active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-medium text-gray-700">Produit actif</span>
                                </label>
                            </div>
                            <Field label="Quantité en stock" required error={errors.stock_quantity}>
                                <input type="number" min="0" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Stock minimum" required error={errors.stock_minimum}>
                                <input type="number" min="0" value={data.stock_minimum} onChange={(e) => setData('stock_minimum', e.target.value)} className={inputClass} />
                            </Field>
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                            <Link
                                href={route('products.index')}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Annuler
                            </Link>
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
            </div>
        </AuthenticatedLayout>
    );
}
