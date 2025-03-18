<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    // The table name is automatically "statuses"
    protected $fillable = ['status_name'];
}
