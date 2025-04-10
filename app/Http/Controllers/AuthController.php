<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile; // Add this
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles_id' => 'sometimes|integer|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'roles_id' => $request->input('roles_id', 2),
        ]);

        // Create a profile for the new user
        Profile::create([
            'user_id' => $user->user_id,
            'first_name' => '', // Default empty, user can update later
            'last_name' => '',
            'middle_initial' => null,
            'birthdate' => null,
            'phone' => null,
            'profile_picture' => null,
        ]);

        $token = $user->createToken('Laravel')->accessToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token' => $token,
            'user' => $user
        ], 201);
    }

    // Rest of the methods (login, logout, userProfile) remain unchanged
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }

        $token = $user->createToken('YourAppName')->accessToken;

        return response()->json([
            'message' => 'Login successful!',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->tokens()->delete();
            return response()->json(['message' => 'Logged out successfully!'], 200);
        }

        return response()->json(['error' => 'User not found.'], 400);
    }

    public function userProfile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}