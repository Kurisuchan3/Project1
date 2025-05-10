<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated. Please provide a valid API token.'], 401);
        }

        $cartItems = CartItem::where('user_id', $user->user_id)->with('product')->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems,
        ], 200);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);

        $cartItem = CartItem::where('user_id', $user ? $user->user_id : null)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user ? $user->user_id : null,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Item added to cart', 'cartItem' => $cartItem->load('product')], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cartItem = CartItem::where('user_id', $user ? $user->user_id : null)
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Cart updated', 'cartItem' => $cartItem->load('product')]);
    }

    public function remove($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('user_id', $user ? $user->user_id : null)
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    public function syncGuestCart(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $guestCart = $request->input('cart', []);
        foreach ($guestCart as $item) {
            $cartItem = CartItem::where('user_id', $user->user_id)
                ->where('product_id', $item['id'])
                ->first();

            if ($cartItem) {
                $cartItem->quantity += $item['quantity'];
                $cartItem->save();
            } else {
                CartItem::create([
                    'user_id' => $user->user_id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        return response()->json(['message' => 'Guest cart synced']);
    }
}