<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UsersController::class, 'getUsers']);
// Add this line to make /products public
Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::get('/inventory/archived', [InventoryController::class, 'archived']);
    Route::put('/inventory/{id}/restore', [InventoryController::class, 'restore']);
    Route::apiResource('inventory', InventoryController::class);
    Route::get('/users', [UsersController::class, 'getUsers']);
    Route::get('/users/archived', [UsersController::class, 'getArchivedUsers']);
    Route::put('/users/{id}/archive', [UsersController::class, 'archiveUser']);
    Route::put('/users/{id}/restore', [UsersController::class, 'restoreUser']);
    Route::get('/products/archived', [ProductController::class, 'archived']);
    Route::put('/products/{id}/restore', [ProductController::class, 'restore']);
    // Move this line out of the group to avoid duplication
    Route::apiResource('products', ProductController::class)->except(['index']);
    Route::get('/statuses', [StatusController::class, 'index']);
});