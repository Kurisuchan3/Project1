<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(Inventory::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'itemname' => 'required|string|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'cost' => 'required|numeric|min:0',
            'warehouse_location' => 'required|string|max:255',
            'last_restock_date' => 'nullable|date',
        ]);

        $inventory = Inventory::create($validatedData);
        return response()->json($inventory, 201);
    }

    public function show($id)
    {
        return response()->json(Inventory::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'itemname' => 'required|string|max:100',
            'stock_quantity' => 'required|integer|min:0',
            'cost' => 'required|numeric|min:0',
            'warehouse_location' => 'required|string|max:255',
            'last_restock_date' => 'nullable|date',
        ]);

        $inventory = Inventory::findOrFail($id);
        $inventory->update($validatedData);
        return response()->json($inventory);
    }

    public function destroy($id)
    {
        Inventory::destroy($id);
        return response()->json([
            'message' => 'Item deleted successfully',
            'deleted_id' => (int)$id
        ]);
    }
}