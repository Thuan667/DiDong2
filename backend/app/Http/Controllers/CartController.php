<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart; // Model cho giỏ hàng
use App\Models\Product;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        $existingItem = ShoppingCart::where('user_id', $request->user_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingItem) {
            // Tăng số lượng nếu sản phẩm đã tồn tại
            $existingItem->quantity += $request->quantity;
            $existingItem->save();

            return response()->json([
                'message' => 'Product quantity updated in cart successfully',
                'data' => $existingItem
            ], 200);
        }

        // Thêm sản phẩm mới vào giỏ hàng
        $cartItem = ShoppingCart::create([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price' => $product->price,
        ]);

        return response()->json([
            'message' => 'Product added to cart successfully',
            'data' => $cartItem
        ], 201);
    }
}
