<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // GET /products
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // POST /products
    public function store(Request $request)
    {
        // Validate image file along with other fields
        $validator = Validator::make($request->all(), [
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'name'           => 'required|string|max:255',
            'price'          => 'required|numeric',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|string',
            'status_id'      => 'nullable|exists:statuses,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        
        // Check if an image file was uploaded
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            // Store in storage/app/public/uploads/products
            $filePath = $file->storeAs('uploads/products', $filename, 'public');
            // Save the public URL in the database
            $data['image'] = '/storage/' . $filePath;
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    // GET /products/archived
    public function archived()
    {
        // Return only soft-deleted products
        $archivedProducts = Product::onlyTrashed()->get();
        return response()->json($archivedProducts);
    }

    // GET /products/{id}
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // PUT/PATCH /products/{id}
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'name'           => 'required|string|max:255',
            'price'          => 'required|numeric',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|string',
            'status_id'      => 'nullable|exists:statuses,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            $filePath = $file->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $filePath;
        }

        $product->update($data);
        return response()->json($product);
    }

    // DELETE /products/{id} – soft delete (archive)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product archived (soft deleted)']);
    }

    // PUT /products/{id}/restore – restore a soft-deleted product
    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();
        return response()->json(['message' => 'Product restored successfully']);
    }
}
