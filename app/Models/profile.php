<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profiles';
    protected $primaryKey = 'profile_id';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'middle_initial',
        'birthdate',
        'phone',
        'profile_picture',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}