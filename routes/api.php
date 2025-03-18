<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StatusController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ✅ Public Routes (No Authentication Required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UsersController::class, 'getUsers']);

// ✅ Protected Routes (Require Passport Authentication)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'userProfile']);

    // ✅ Inventory Management
    Route::apiResource('inventory', InventoryController::class);

    // ✅ User Management
    Route::get('/users', [UsersController::class, 'getUsers']);
    Route::get('/users/archived', [UsersController::class, 'getArchivedUsers']);
    Route::put('/users/{id}/archive', [UsersController::class, 'archiveUser']);
    Route::put('/users/{id}/restore', [UsersController::class, 'restoreUser']);

    // Custom routes for products – place these BEFORE the resource route
    Route::get('/products/archived', [ProductController::class, 'archived']);
    Route::put('/products/{id}/restore', [ProductController::class, 'restore']);

    // Now register the standard resource routes for products.
    Route::apiResource('products', ProductController::class);
    
    Route::get('/statuses', [StatusController::class, 'index']);
});
