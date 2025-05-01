<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['subcategory', 'inventory'])->get(); // Include inventory relationship
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'name'           => 'required|string|max:255',
            'price'          => 'required|numeric',
            'quantity'       => 'required|integer|min:0',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|string',
            'status_id'      => 'nullable|exists:statuses,id',
            'subcategory_id' => 'nullable|exists:subcategories,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $file     = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $filePath;
        }

        $product = Product::create($data);

        Inventory::create([
            'product_id'     => $product->id,
            'stock_quantity' => $data['quantity'],
            'last_restock'   => now(),
            'stock_status'   => $data['quantity'] == 0 ? 'Out of Stock' : 'In Stock'
        ]);

        return response()->json($product->load('subcategory'), 201);
    }

    public function archived()
    {
        $archivedProducts = Product::onlyTrashed()->with('subcategory')->get();
        return response()->json($archivedProducts);
    }

    public function show($id)
    {
        $product = Product::with('subcategory')->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'name'           => 'required|string|max:255',
            'price'          => 'required|numeric',
            'quantity'       => 'required|integer|min:0',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|string',
            'status_id'      => 'nullable|exists:statuses,id',
            'subcategory_id' => 'nullable|exists:subcategories,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $file     = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $filePath;
        }

        $product->update($data);

        $inventory = Inventory::where('product_id', $product->id)->first();
        $newStatus = $data['quantity'] == 0 ? 'Out of Stock' : 'In Stock';
        if ($inventory) {
            $inventory->update([
                'stock_quantity' => $data['quantity'],
                'last_restock'   => now(),
                'stock_status'   => $newStatus,
            ]);
        } else {
            Inventory::create([
                'product_id'     => $product->id,
                'stock_quantity' => $data['quantity'],
                'last_restock'   => now(),
                'stock_status'   => $newStatus,
            ]);
        }

        return response()->json($product->load('subcategory'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product archived (soft deleted)']);
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();
        return response()->json(['message' => 'Product restored successfully']);
    }
}