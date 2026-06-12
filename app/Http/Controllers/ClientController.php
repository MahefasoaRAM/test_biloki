<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'clients' => Client::latest()->paginate(25)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
        ]);
        Client::create($validated);
        return redirect()->route('clients.index')->with('success', 'client créé avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return Inertia::render('Clients/Show', ['client' => $client]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', ['client' => $client]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => ['nullable', 'email', Rule::unique('clients', 'email')->ignore($client->id)],
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
        ]);
        $client->update($validated);
        return redirect()->route('clients.index')->with('success', 'client modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->route('clients.index')->with('success', 'client supprimé avec succès');
    }
}
