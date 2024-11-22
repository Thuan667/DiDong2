<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShoppingCartsTable extends Migration
{
    public function up()
    {
        Schema::create('shoppingcarts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('cart_items'); // hoặc các cột khác mà bạn cần
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shoppingcarts');
    }
}

