import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, product }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Détail produit
                </h2>
            }
        >
            <Head title={product.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p><Link href={route('products.edit')} >Modifier</Link> &nbsp; <Link href={route('products.index')} >Retour</Link></p>
                            <p>{product.name}</p>
                            <p>{product.reference}</p>
                            <p>{product.marque}</p>
                            <p>{product.description}</p>
                            <p>{product.stock_minimum}</p>
                            <p>{product.stock_quantity}</p>
                            <p>{product.price}</p>
                            <p>{product.active}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
