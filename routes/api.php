<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UsersController;

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
    Route::get('/users/archived', [UsersController::class, 'getArchivedUsers']); // 🔥 Add this line!
    Route::put('/users/{id}/archive', [UsersController::class, 'archiveUser']);
    Route::put('/users/{id}/restore', [UsersController::class, 'restoreUser']);



});
