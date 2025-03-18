<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        // Retrieve all statuses and return as JSON
        $statuses = Status::all();
        return response()->json($statuses);
    }
}
