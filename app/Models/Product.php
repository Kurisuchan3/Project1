<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'subcategory_id',
        'inventory_id',
        'name',
        'price',
        'description',
        'specifications',
        'image_url',
        'statuses_id',
    ];
}

