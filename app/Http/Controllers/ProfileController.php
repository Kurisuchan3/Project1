<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
            Log::error('Profile not found for user_id: ' . $user->user_id);
            return response()->json([
                'success' => false,
                'message' => 'Profile not found!',
            ], 404);
        }

        try {
            // Log raw request data for debugging
            Log::info('Update Profile Raw Input:', [
                'all' => $request->all(),
                'input_first_name' => $request->input('first_name'),
                'input_last_name' => $request->input('last_name'),
                'input_middle_initial' => $request->input('middle_initial'),
                'input_phone' => $request->input('phone'),
                'input_birthdate' => $request->input('birthdate'),
                'input_username' => $request->input('username'),
                'input_email' => $request->input('email'),
            ]);

            // Prepare profile update data
            $profileData = [
                'first_name' => $request->has('first_name') ? $request->input('first_name') : $profile->first_name,
                'last_name' => $request->has('last_name') ? $request->input('last_name') : $profile->last_name,
                'middle_initial' => $request->has('middle_initial') ? $request->input('middle_initial') : $profile->middle_initial,
                'phone' => $request->has('phone') ? $request->input('phone') : $profile->phone,
                'birthdate' => $request->has('birthdate') ? $request->input('birthdate') : $profile->birthdate,
            ];

            // Handle empty strings for nullable fields
            if (isset($profileData['middle_initial']) && $profileData['middle_initial'] === '') {
                $profileData['middle_initial'] = null;
            }
            if (isset($profileData['phone']) && $profileData['phone'] === '') {
                $profileData['phone'] = null;
            }
            if (isset($profileData['birthdate']) && $profileData['birthdate'] === '') {
                $profileData['birthdate'] = null;
            }

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                // Validate file (e.g., size, type)
                if ($file->isValid()) {
                    // Generate a unique filename
                    $filename = uniqid('pfp_') . '.' . $file->getClientOriginalExtension();
                    // Store the file directly in public/images/pfp
                    $file->move(public_path('images/pfp'), $filename);
                    // Store the relative path
                    $profileData['profile_picture'] = 'images/pfp/' . $filename;

                    // Optionally, delete the old profile picture if it exists
                    if ($profile->profile_picture && file_exists(public_path($profile->profile_picture))) {
                        unlink(public_path($profile->profile_picture));
                    }
                } else {
                    Log::warning('Invalid profile picture upload for user_id: ' . $user->user_id);
                }
            }

            // Update profile using Eloquent
            $profile->update($profileData);

            // Update username in users table if provided and different
            $newUsername = $request->input('username', $user->username);
            if ($newUsername !== $user->username) {
                $user->username = $newUsername;
                $user->save();
            }

            // Fetch updated profile and user data
            $updatedProfile = Profile::where('user_id', $user->user_id)->first();
            $updatedUser = User::find($user->user_id);

            Log::info('Profile updated successfully:', $updatedProfile->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully!',
                'data' => [
                    'username' => $updatedUser->username,
                    'email' => $updatedUser->email,
                    'first_name' => $updatedProfile->first_name,
                    'last_name' => $updatedProfile->last_name,
                    'middle_initial' => $updatedProfile->middle_initial,
                    'phone' => $updatedProfile->phone,
                    'birthdate' => $updatedProfile->birthdate,
                    'profile_picture' => $updatedProfile->profile_picture,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Profile update failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage(),
            ], 500);
        }
    }
}