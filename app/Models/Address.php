<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $primaryKey = 'address_id';

    protected $fillable = [
        'user_id',
        'barangay',
        'city',
        'province',
        'country',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}