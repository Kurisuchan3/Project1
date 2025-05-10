<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UsersController::class, 'getUsers']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/subcategories', [SubcategoryController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

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
    Route::apiResource('products', ProductController::class)->except(['index']);
    Route::get('/statuses', [StatusController::class, 'index']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::post('/cart/sync', [CartController::class, 'syncGuestCart']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address_id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address_id}', [AddressController::class, 'destroy']);
    Route::post('/addresses/{address_id}/set-default', [AddressController::class, 'setDefault']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});