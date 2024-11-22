<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProduct;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    // public function index()
    // {
    //     return Product::with("category", "stocks")->paginate(5);
    // }
    public function index() {
        $products = Product::all(); // Hoặc bất kỳ logic nào để lấy sản phẩm
        return response()->json($products);
    }
    public function getProductsByCategory($categoryId)
    {
        \Log::info('Fetching products for category ID: ' . $categoryId);

        $products = Product::where('category_id', $categoryId)->with('category')->get();

        if ($products->isEmpty()) {
            \Log::info('No products found for category ID: ' . $categoryId);
            return response()->json(['message' => 'No products found'], 404);
        }

        \Log::info('Products found: ', $products->toArray());
        return response()->json($products);
    }

    public function showAllSearch(Request $request)
    {
        $keyword = $request->input('query');

        // Nếu không có từ khóa, trả về tất cả sản phẩm
        if (empty($keyword)) {
            return Product::with("category", "stocks")->get();
        }

        // Tìm kiếm sản phẩm theo từ khóa trong tên hoặc mô tả
        return Product::with("category", "stocks")
            ->where('name', 'LIKE', "%{$keyword}%")
            ->orWhere('description', 'LIKE', "%{$keyword}%")
            ->get();
    }
    public function show($id)
    {
        $product = Product::with("category", "stocks")->findOrFail($id);
        if ($product->reviews()->exists()) {
            $product['review'] = $product->reviews()->avg('rating');
            $product['num_reviews'] = $product->reviews()->count();
        }
        return $product;
    }

    public function store(StoreProduct $request)
    {
        $validator = $request->validated();

        $photoName = $request->photo;

        $product = Product::create([
            'category_id' => $request->category_id,
            'photo' => $photoName,
            'brand' => $request->brand,
            'name' => $request->name,
            'description' => $request->description,
            'details' => $request->details,
            'price' => $request->price,
        ]);

        Stock::create([
            'product_id' => $product->id,
            'size' => $request->size,
            'color' => $request->color,
            'quantity' => $request->quantity,
        ]);

        return response()->json(['product' => $product, 'message' => 'Product created successfully'], 201);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product) {
            if ($product->photo != null) {
                foreach (json_decode($product->photo) as $photo) {
                    unlink(public_path() . '\\img\\' . $photo);
                }
            }
            $product->delete();
        }
    }
    public function search(Request $request)
    {
        \Log::info('Search method called');

        $query = $request->input('query');
        \Log::info('Searching for: ' . $query);

        // Tìm kiếm chỉ theo tên sản phẩm
        $product = Product::where('name', 'like', "%$query%")->get();

        \Log::info('Products found: ' . $product->count());

        return response()->json($product);
    }
}
