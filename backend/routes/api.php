<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductOrdersController;
use App\Http\Controllers\ShoppingCartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });




// Dashboard
Route::get('/dashboard', 'App\Http\Controllers\DashboardController@index');

// JWT Authenficiation
Route::get('/auth', 'App\Http\Controllers\UserController@getAuthenticatedUser');
Route::post('/register', 'App\Http\Controllers\UserController@register');
Route::post('/login', 'App\Http\Controllers\UserController@login');

// Address
Route::get('/user/default-address', 'App\Http\Controllers\UserAddressController@show');
Route::post('/user/create-user-address', 'App\Http\Controllers\UserAddressController@createUser');
Route::post('/user/address', 'App\Http\Controllers\UserAddressController@store');

// Product
Route::get('/products', 'App\Http\Controllers\ProductController@index');
Route::get('/products/{id}', 'App\Http\Controllers\ProductController@show');
Route::get('/product/hot-deal', 'App\Http\Controllers\ProductDealsController@hotDeals');
Route::post('/products', 'App\Http\Controllers\ProductController@store');
Route::delete('/products/{id}', 'App\Http\Controllers\ProductController@destroy');
Route::get('/categories/{id}/products', [ProductController::class, 'getProductsByCategory']);
Route::get('/productSearch', [ProductController::class, 'showAllSearch']);


// Product Orders
Route::post('/stripe', 'App\Http\Controllers\ProductOrdersController@stripePost');
Route::post('/product/orders', 'App\Http\Controllers\ProductOrdersController@store');
Route::post('/create-payment-intent', [ProductOrdersController::class, 'createPaymentIntent']);

// Product Categories
Route::get('/product/categories', 'App\Http\Controllers\CategoryController@index');
Route::get('/product/categories/{id}/top-selling', 'App\Http\Controllers\CategoryController@topSelling');
Route::get('/product/categories/{id}/new', 'App\Http\Controllers\CategoryController@new');
Route::get('/products/category/{categoryId}', 'App\Http\Controllers\ProductController@getProductsByCategory');

// Product Shopping Cart
Route::post('/cart', [ShoppingCartController::class, 'store']);
Route::get('/cart', [ShoppingCartController::class, 'index']);
Route::put('/cart/{id}', [ShoppingCartController::class, 'update']);
Route::delete('/cart/{id}', [ShoppingCartController::class, 'destroy']);



// Product Stocks
Route::get('/product/stocks/{id}', 'App\Http\Controllers\StockController@show');

// Newsletter
Route::post('/newsletter', 'App\Http\Controllers\NewsLetterController@store');

Route::get('login/facebook', 'Auth\LoginController@redirectToFacebook');
Route::get('login/facebook/callback', 'Auth\LoginController@handleFacebookCallback');
Route::post('/login/facebook', [UserController::class, 'loginWithFacebook']);

Route::post('/abate', 'App\Http\Controllers\AbateController@store');
Route::get('/abate/getAll', 'App\Http\Controllers\AbateController@getAll');
Route::get('/abate/getAbate/{id}', 'App\Http\Controllers\AbateController@getAbateById');
Route::delete('/abate/{id}', 'App\Http\Controllers\AbateController@delete');


Route::post('/products', [ProductController::class, 'store']);
Route::post('/create-payment-intent', [ProductOrdersController::class, 'createPaymentIntent']);

// Product Shopping Cart
Route::get('/product/cart-list/count', 'App\Http\Controllers\ProductShoppingCartController@cartCount');
Route::get('/product/cart-list', 'App\Http\Controllers\ProductShoppingCartController@index');
Route::post('/product/cart-list', 'App\Http\Controllers\ProductShoppingCartController@store');
Route::post('/product/cart-list/guest', 'App\Http\Controllers\ProductShoppingCartController@guestCart');
Route::put('/product/cart-list/{id}', 'App\Http\Controllers\ProductShoppingCartController@update');
Route::delete('/product/cart-list/{id}', 'App\Http\Controllers\ProductShoppingCartController@destroy');

//search
Route::get('/product/search', [ProductController::class, 'search']);


//uer
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::post('/users/{id}/change-password', [UserController::class, 'changePassword']);
