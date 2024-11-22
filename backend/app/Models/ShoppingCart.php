<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id', 'quantity', 'price']; // Cập nhật thuộc tính

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function product() {
        return $this->belongsTo('App\Models\Product'); // Chỉnh sửa từ stock sang product
    }
}
