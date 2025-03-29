<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * ✅ Register a new user and generate API token
     */
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'username' => 'required|string|max:255|unique:users',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'roles_id' => 'sometimes|integer|exists:roles,id', // ✅ Optional validation for roles_id
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 400);
    }

    $user = User::create([
        'username' => $request->username,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'roles_id' => $request->input('roles_id', 2), // ✅ Default to 2 (Customer)
    ]);

    $token = $user->createToken('Laravel')->accessToken;

    return response()->json([
        'message' => 'User registered successfully!',
        'token' => $token,
        'user' => $user
    ], 201);
}

    /**
     * ✅ Login (Fixed for Passport)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // ✅ Manually Verify User (Because `Auth::attempt()` is not for Passport)
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }

        // ✅ Issue Passport Token
        $token = $user->createToken('YourAppName')->accessToken;

        return response()->json([
            'message' => 'Login successful!',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * ✅ Logout (Revoke All Tokens)
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->tokens()->delete(); // ✅ Revoke all tokens for this user
            return response()->json(['message' => 'Logged out successfully!'], 200);
        }

        return response()->json(['error' => 'User not found.'], 400);
    }

    /**
     * ✅ Get Authenticated User Profile
     */
    public function userProfile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
