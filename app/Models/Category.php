<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Specify the table name (optional, as 'categories' matches Laravel's convention)
    protected $table = 'categories';

    // Define fillable fields for mass assignment
    protected $fillable = [
        'name',
    ];

    // Timestamps are included by default, no need to specify unless disabling
    public $timestamps = true;

    // Relationship: A category has many subcategories
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class, 'category_id');
    }
}