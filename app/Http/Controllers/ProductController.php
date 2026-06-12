<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query()->latest();

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(25)->withQueryString();

        // Ajoute le stock_status à chaque produit (utilisable côté front)
        $products->getCollection()->transform(function ($product) {
            $product->stock_status = $product->getStockStatus();
            return $product;
        });

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters'  => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'reference' => 'required|string|unique:products,reference',
            'price' => 'required',
            'stock_quantity' => 'required',
            'stock_minimum' => 'required',
        ]);
        Product::create($validated);
        return redirect()->route('products.index')->with('success', 'Produit créé avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            'stockMovements' => fn($query) => $query->latest()->take(10),
        ]);
        return Inertia::render('Products/Show', ['product' => $product]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'reference' => 'required|string|unique:products,reference,' . $product->id,
            'price' => 'required',
            'stock_quantity' => 'required',
            'stock_minimum' => 'required',
        ]);
        $product->update($validated);
        return redirect()->route('products.index')->with('success', 'Produit modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Produit supprimé avec succès');
    }
}
