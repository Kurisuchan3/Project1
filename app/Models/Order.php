<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'address_id',
        'barangay',
        'city',
        'province',
        'country',
        'order_notes',
        'subtotal',
        'shipping_fee',
        'total',
        'status_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id', 'address_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function paymentDetail()
    {
        return $this->hasOne(PaymentDetail::class);
    }
}