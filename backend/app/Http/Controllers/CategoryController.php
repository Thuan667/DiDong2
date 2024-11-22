<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Review;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Category::all();
    }
    public function getProductsByCategory($id) {
        return Product::where('category_id', $id)->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function new($id)
    {
        $products = Product::with('category')->where('category_id', $id)->orderBy('id', 'desc')->paginate(6);

        foreach($products as $product) {
            if($product->reviews()->exists()) {
                $product['review'] = $product->reviews()->avg('rating');
            }
        }
        return $products;
    }



    public function topSelling($id) {

        $products = Product::with('category')->where('category_id', $id)->take(6)->get();

        foreach($products as $product) {
            if($product->reviews()->exists())
                $product['review'] = $product->reviews()->avg('rating');

            if($product->stocks()->exists()) {
                $num_orders = 0;
                $stocks = $product->stocks()->get();
                foreach($stocks as $stock)
                    $num_orders += $stock->orders()->count();
                $product['num_orders'] = $num_orders;
            }  else {
                $product['num_orders'] = 0;
            }
        }
        return $products->sortByDesc('num_orders')->values()->all();
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        //
    }
}
