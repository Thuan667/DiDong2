<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductShoppingCartController extends Controller
{
    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // Lấy danh sách giỏ hàng của người dùng với thông tin sản phẩm
        $cartList = $user->cartItems()
            ->with('product')
            ->orderBy('id', 'desc')
            ->get();

        return $cartList;
    }

    public function store(Request $request)
    {
        $request->validate([
            'productId' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric'
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        // Lưu item vào giỏ hàng
        $item = $user->cartItems()->where('product_id', $request->productId)->first();

        if (!$item) {
            ShoppingCart::create([
                'user_id' => $user->id,
                'product_id' => $request->productId,
                'quantity' => $request->quantity,
                'price' => $request->price // Lưu giá vào giỏ hàng
            ]);
        } else {
            $item->increment('quantity', $request->quantity);
        }

        return response()->json(['message' => 'Item added to cart successfully']);
    }


    public function guestCart(Request $request)
    {
        $cartList = json_decode($request['cartList'], true);

        $data = [];
        $count = 1;
        foreach ($cartList as $cartArrayList) {
            foreach ($cartArrayList as $cartItem) {
                if ($cartItem['product_id'] != null || $cartItem['quantity'] != null) {
                    $product = Product::where('id', $cartItem['product_id'])->first();
                    $data[] = [
                        'id' => $count,
                        'product_id' => $cartItem['product_id'],
                        'quantity' => $cartItem['quantity'],
                        'product' => $product,
                        'price' => $cartItem['price']
                    ];
                    $count++;
                }
            }
        }

        return $data;
    }

    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::with('product')->where('id', $id)->first();

        // Kiểm tra số lượng tồn kho của sản phẩm và cập nhật
        if ($request->quantity <= $cartItem->product->stock_quantity && $request->quantity > 0) {
            $cartItem->update(['quantity' => $request->quantity]);
        }
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user) {
            $cartItem = $user->cartItems()->findOrFail($id);

            if ($cartItem) {
                $cartItem->delete();
                return response()->json(['message' => 'Item removed from cart successfully']);
            }
        }

        return response()->json(['message' => 'Item not found'], 404);
    }


    public function cartCount(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        return $user->cartItems()->pluck('product_id')->toArray();
    }
}
