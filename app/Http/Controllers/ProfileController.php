<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = Auth::user();
        $profile = Profile::where('user_id', $user->user_id)->first();

        if (!$profile) {
            $profile = Profile::create([
                'user_id' => $user->user_id,
                'first_name' => '',
                'last_name' => '',
                'middle_initial' => null,
                'phone' => null,
                'birthdate' => null,
                'profile_picture' => null,
            ]);
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

        // Log the request data for debugging
        \Log::info('Update Profile Request Data:', $request->all());
        \Log::info('Files in Request:', $request->files->all());

        // Validate the request
        $validated = $request->validate([
            'username' => 'sometimes|string|unique:users,username,' . $user->user_id . ',user_id',
            'email' => 'sometimes|email|unique:users,email,' . $user->user_id . ',user_id',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'middle_initial' => 'sometimes|nullable|string|max:1',
            'phone' => 'sometimes|nullable|string|max:15',
            'birthdate' => 'sometimes|nullable|date',
            'profile_picture' => 'sometimes|nullable|image|mimes:jpeg,png|max:1024',
            'password' => 'sometimes|nullable|string|min:6',
        ]);

        // Update user fields if present
        if ($request->has('username')) {
            $user->username = $validated['username'];
        }
        if ($request->has('email')) {
            $user->email = $validated['email'];
        }
        if ($request->has('password') && !empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->save();

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            \Log::info('Profile picture file detected, processing upload...');
            try {
                // Delete old profile picture if exists
                if ($profile->profile_picture) {
                    \Log::info('Deleting old profile picture: ' . $profile->profile_picture);
                    Storage::delete('public/' . $profile->profile_picture);
                }
                $file = $request->file('profile_picture');
                \Log::info('File details:', [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                ]);
                $path = $file->store('profile_pictures', 'public');
                \Log::info('Profile picture stored at: ' . $path);
                $profile->profile_picture = $path;
            } catch (\Exception $e) {
                \Log::error('Error uploading profile picture: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture.',
                ], 500);
            }
        } else {
            \Log::info('No profile picture file detected in request.');
        }

        // Update profile fields if present
        if ($request->has('first_name')) {
            $profile->first_name = $validated['first_name'];
        }
        if ($request->has('last_name')) {
            $profile->last_name = $validated['last_name'];
        }
        if ($request->has('middle_initial')) {
            $profile->middle_initial = $validated['middle_initial'] ?? null;
        }
        if ($request->has('phone')) {
            $profile->phone = $validated['phone'];
        }
        if ($request->has('birthdate')) {
            $profile->birthdate = $validated['birthdate'];
        }
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