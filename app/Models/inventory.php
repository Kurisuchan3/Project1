<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory'; // Explicitly set the table name

    protected $fillable = [
        'itemname', 'stock_quantity', 'cost', 'warehouse_location', 'last_restock_date'
    ];
}



