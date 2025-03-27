<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Validator;

class InventoryController extends Controller
{
    // GET /api/inventory
    public function index()
    {
        $inventories = Inventory::with('product')->get();
        return response()->json($inventories);
    }

    // GET /api/inventory/archived
    public function archived()
    {
        $archived = Inventory::onlyTrashed()->with('product')->get();
        return response()->json($archived);
    }

    // POST /api/inventory
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'     => 'required|exists:products,id',
            'stock_quantity' => 'required|integer|min:0',
            'last_restock'   => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        // Set last_restock if not provided
        if (empty($data['last_restock'])) {
            $data['last_restock'] = now();
        }
        // Set stock_status automatically based on quantity
        $data['stock_status'] = $data['stock_quantity'] == 0 ? 'Out of Stock' : 'In Stock';

        $inventory = Inventory::create($data);
        return response()->json($inventory, 201);
    }

    // GET /api/inventory/{id}
    public function show($id)
    {
        $inventory = Inventory::with('product')->findOrFail($id);
        return response()->json($inventory);
    }

    // PUT/PATCH /api/inventory/{id}
    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'stock_quantity' => 'required|integer|min:0',
            'last_restock'   => 'nullable|date'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $data = $request->all();
        if (empty($data['last_restock'])) {
            $data['last_restock'] = now();
        }
        // Update stock_status based on new quantity
        $data['stock_status'] = $data['stock_quantity'] == 0 ? 'Out of Stock' : 'In Stock';

        $inventory->update($data);
        return response()->json($inventory);
    }

    // DELETE /api/inventory/{id} – soft delete (archive)
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        return response()->json(['message' => 'Inventory archived (soft deleted)']);
    }

    // PUT /api/inventory/{id}/restore – restore a soft-deleted inventory record
    public function restore($id)
    {
        $inventory = Inventory::withTrashed()->findOrFail($id);
        $inventory->restore();
        return response()->json(['message' => 'Inventory restored successfully']);
    }
}
