<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'image', 'name', 'price', 'quantity', 'description', 'specifications', 'status_id'
    ];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
