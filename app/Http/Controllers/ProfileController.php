<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Fetch the authenticated user's profile
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user
        $profile = Profile::where('user_id', $user->user_id)->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'middle_initial' => $profile->middle_initial,
                'phone' => $profile->phone,
                'birthdate' => $profile->birthdate,
                'profile_picture' => $profile->profile_picture,
            ],
        ], 200);
    }

    /**
     * Update the authenticated user's profile
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $profile = Profile::where('user_id', $user->user_id)->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found!',
            ], 404);
        }

        // Validate the request
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->user_id . ',user_id',
            'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:1',
            'phone' => 'nullable|string|max:15',
            'birthdate' => 'nullable|date',
            'profile_picture' => 'nullable|string|max:500', // Now accepts URL
            'password' => 'nullable|string|min:6', // Optional password
        ]);

        // Update user data
        $user->username = $validated['username'];
        $user->email = $validated['email'];

        // Optional: handle password change
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        // Update profile data
        $profile->first_name = $validated['first_name'];
        $profile->last_name = $validated['last_name'];
        $profile->middle_initial = $validated['middle_initial'] ?? null;
        $profile->phone = $validated['phone'];
        $profile->birthdate = $validated['birthdate'];
        $profile->profile_picture = $validated['profile_picture']; // Set URL string
        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully!',
            'data' => [
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'middle_initial' => $profile->middle_initial,
                'phone' => $profile->phone,
                'birthdate' => $profile->birthdate,
                'profile_picture' => $profile->profile_picture,
            ],
        ], 200);
    }
}
