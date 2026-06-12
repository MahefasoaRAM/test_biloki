<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index(Request $request) {
        $query = StockMovement::with('product')->latest();

        if ($search = $request->string('search')->toString()) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($type = $request->string('type')->toString()) {
            $query->where('type', $type);
        }

        $movements = $query->paginate(25)->withQueryString();

        $products = Product::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'reference', 'stock_quantity']);

        // Stats globales
        $stats = [
            'total' => StockMovement::count(),
            'in'    => StockMovement::where('type', 'in')->count(),
            'out'   => StockMovement::where('type', 'out')->count(),
            'low_stock' => Product::where('active', true)
                ->whereColumn('stock_quantity', '<=', 'stock_minimum')
                ->where('stock_quantity', '>', 0)
                ->count(),
            'out_of_stock' => Product::where('active', true)
                ->where('stock_quantity', '<=', 0)
                ->count(),
        ];

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'products'  => $products,
            'stats'     => $stats,
            'filters'   => $request->only('search', 'type'),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type'       => 'required|in:in,out',
            'quantity'   => 'required|integer|min:1',
            'note'       => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($validated) {
            $product = Product::lockForUpdate()->findOrFail($validated['product_id']);

            if ($validated['type'] === 'out' && $product->stock_quantity < $validated['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => "Stock insuffisant (disponible : {$product->stock_quantity})",
                ]);
            }

            if ($validated['type'] === 'in') {
                $product->stock_quantity += $validated['quantity'];
            } else {
                $product->stock_quantity -= $validated['quantity'];
            }
            $product->save();

            StockMovement::create($validated);
        });

        return redirect()->route('stock-movements.index')->with('success', 'Mouvement de stock enregistré avec succès');
    }
}
