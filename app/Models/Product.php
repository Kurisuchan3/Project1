<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'image', 'name', 'price', 'description', 'specifications', 'status_id'
    ];

    // If you create a Status model, this relationship lets you access the status details.
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
