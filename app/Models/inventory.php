<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use SoftDeletes;

    protected $fillable = ['product_id', 'stock_quantity', 'stock_status', 'last_restock'];

    public function product()
    {
        return $this->belongsTo(\App\Models\Product::class);
    }
}
