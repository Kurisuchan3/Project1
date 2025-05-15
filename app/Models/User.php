<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'email',
        'password',
        'roles_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'roles_id');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'user_id');
    }

    public function isAdmin()
    {
        return $this->roles_id === 1; // Assuming roles_id 1 is for admin
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'user_id', 'user_id');
    }
}