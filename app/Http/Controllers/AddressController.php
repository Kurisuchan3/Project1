<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $addresses = Address::where('user_id', $user->user_id)->get();
        $profile = Profile::where('user_id', $user->user_id)->first();
        $userData = User::find($user->user_id);

        // Combine user and profile data with each address
        $addresses = $addresses->map(function ($address) use ($userData, $profile) {
            return [
                'address_id' => $address->address_id,
                'user_id' => $address->user_id,
                'barangay' => $address->barangay,
                'city' => $address->city,
                'province' => $address->province,
                'country' => $address->country,
                'is_default' => $address->is_default,
                'created_at' => $address->created_at,
                'updated_at' => $address->updated_at,
                'username' => $userData->username,
                'first_name' => $profile->first_name,
                'middle_initial' => $profile->middle_initial,
                'last_name' => $profile->last_name,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $addresses,
        ], 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        try {
            $validated = $request->validate([
                'barangay' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'is_default' => 'sometimes|boolean',
            ]);

            // If this is the first address, set it as default
            $isFirstAddress = Address::where('user_id', $user->user_id)->count() === 0;
            $isDefault = $isFirstAddress ? true : $request->input('is_default', false);

            // If setting this address as default, unset others
            if ($isDefault) {
                Address::where('user_id', $user->user_id)->update(['is_default' => false]);
            }

            $address = Address::create([
                'user_id' => $user->user_id,
                'barangay' => $validated['barangay'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'country' => $validated['country'],
                'is_default' => $isDefault,
            ]);

            // Fetch user and profile data to include in the response
            $profile = Profile::where('user_id', $user->user_id)->first();
            $userData = User::find($user->user_id);

            $addressData = [
                'address_id' => $address->address_id,
                'user_id' => $address->user_id,
                'barangay' => $address->barangay,
                'city' => $address->city,
                'province' => $address->province,
                'country' => $address->country,
                'is_default' => $address->is_default,
                'created_at' => $address->created_at,
                'updated_at' => $address->updated_at,
                'username' => $userData->username,
                'first_name' => $profile->first_name,
                'middle_initial' => $profile->middle_initial,
                'last_name' => $profile->last_name,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Address added successfully!',
                'data' => $addressData,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Address creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add address: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $address_id)
    {
        $user = Auth::user();
        $address = Address::where('user_id', $user->user_id)->where('address_id', $address_id)->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found!',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'barangay' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'is_default' => 'sometimes|boolean',
            ]);

            $isDefault = $request->input('is_default', $address->is_default);

            if ($isDefault && !$address->is_default) {
                Address::where('user_id', $user->user_id)->update(['is_default' => false]);
            }

            $address->update([
                'barangay' => $validated['barangay'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'country' => $validated['country'],
                'is_default' => $isDefault,
            ]);

            // Fetch user and profile data to include in the response
            $profile = Profile::where('user_id', $user->user_id)->first();
            $userData = User::find($user->user_id);

            $addressData = [
                'address_id' => $address->address_id,
                'user_id' => $address->user_id,
                'barangay' => $address->barangay,
                'city' => $address->city,
                'province' => $address->province,
                'country' => $address->country,
                'is_default' => $address->is_default,
                'created_at' => $address->created_at,
                'updated_at' => $address->updated_at,
                'username' => $userData->username,
                'first_name' => $profile->first_name,
                'middle_initial' => $profile->middle_initial,
                'last_name' => $profile->last_name,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Address updated successfully!',
                'data' => $addressData,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Address update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update address: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($address_id)
    {
        $user = Auth::user();
        $address = Address::where('user_id', $user->user_id)->where('address_id', $address_id)->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found!',
            ], 404);
        }

        try {
            $address->delete();
            return response()->json([
                'success' => true,
                'message' => 'Address deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Address deletion failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete address: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function setDefault($address_id)
    {
        $user = Auth::user();
        $address = Address::where('user_id', $user->user_id)->where('address_id', $address_id)->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found!',
            ], 404);
        }

        try {
            Address::where('user_id', $user->user_id)->update(['is_default' => false]);
            $address->update(['is_default' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Address set as default successfully!',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Set default address failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to set address as default: ' . $e->getMessage(),
            ], 500);
        }
    }
}