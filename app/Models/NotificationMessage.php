<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationMessage extends Model
{
    protected $fillable = [
        'status_id',
        'message_template',
    ];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}