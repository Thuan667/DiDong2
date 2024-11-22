<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller
{
    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        // Xác thực dữ liệu
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Lấy ID người dùng
        $userId = Auth::id();

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        $cartItem = ShoppingCart::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Nếu chưa, thêm sản phẩm mới vào giỏ hàng
            ShoppingCart::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Sản phẩm đã được thêm vào giỏ hàng'], 201);
    }

    // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
    // public function index()
    // {
    //     $userId = Auth::id();
    //     $cartItems = ShoppingCart::where('user_id', $userId)->with('product')->get();

    //     return response()->json($cartItems);
    // }
    public function index() {
        $products = ShoppingCart::all(); // Hoặc bất kỳ logic nào để lấy sản phẩm
        return response()->json($products);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = ShoppingCart::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Số lượng sản phẩm đã được cập nhật']);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function destroy($id)
    {
        $cartItem = ShoppingCart::findOrFail($id);
        $cartItem->delete();

        return response()->json(['message' => 'Sản phẩm đã được xóa khỏi giỏ hàng']);
    }
}
