<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RateController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('RateController: Incoming request', [
                'headers' => $request->headers->all(),
                'request' => $request->all(),
                'token' => $request->bearerToken(),
            ]);

            $user = Auth::guard('api')->user();
            if (!$user) {
                Log::warning('RateController: No authenticated user found', [
                    'headers' => $request->headers->all(),
                    'token' => $request->bearerToken(),
                ]);
                return response()->json(['success' => false, 'error' => ['message' => 'Unauthorized']], 401);
            }

            Log::info('RateController: Authenticated user', ['user_id' => $user->user_id]);

            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:500',
                'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => ['message' => 'Validation failed', 'details' => $validator->errors()]
                ], 422);
            }

            $existingRating = Rating::where('product_id', $request->product_id)
                ->where('user_id', $user->user_id)
                ->first();

            if ($existingRating) {
                return response()->json([
                    'success' => false,
                    'error' => ['message' => 'You have already rated this product']
                ], 400);
            }

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $filename = 'review_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images/reviews'), $filename);
                $photoPath = 'images/reviews/' . $filename;
            }

            $rating = Rating::create([
                'product_id' => $request->product_id,
                'user_id' => $user->user_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'photo' => $photoPath,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $rating->id,
                    'product_id' => $rating->product_id,
                    'user_id' => $rating->user_id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'photo' => $rating->photo,
                    'created_at' => $rating->created_at,
                    'updated_at' => $rating->updated_at,
                ],
                'photo_url' => $photoPath ? asset($photoPath) : null,
            ], 201);
        } catch (\Exception $e) {
            Log::error('RateController: Failed to save rating', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'headers' => $request->headers->all(),
                'token' => $request->bearerToken(),
            ]);
            return response()->json([
                'success' => false,
                'error' => ['message' => 'Failed to save rating']
            ], 500);
        }
    }

    public function getProductRatings(Request $request, $productId)
    {
        try {
            $ratings = Rating::where('product_id', $productId)
                ->with([
                    'user.profile' => function ($query) {
                        $query->select('profile_id', 'user_id', 'first_name', 'middle_initial', 'last_name', 'profile_picture');
                    }
                ])
                ->get()
                ->map(function ($rating) {
                    $name = $rating->user && $rating->user->profile
                        ? trim(
                            ($rating->user->profile->first_name ?? '') . 
                            ($rating->user->profile->middle_initial ? ' ' . $rating->user->profile->middle_initial . '.' : '') . 
                            ($rating->user->profile->last_name ? ' ' . $rating->user->profile->last_name : '')
                        )
                        : ($rating->user ? $rating->user->username : 'Anonymous');

                    return [
                        'id' => $rating->id,
                        'product_id' => $rating->product_id,
                        'user_id' => $rating->user_id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'photo' => $rating->photo ? asset($rating->photo) : null,
                        'created_at' => $rating->created_at,
                        'updated_at' => $rating->updated_at,
                        'name' => $name,
                        'profile_picture' => $rating->user && $rating->user->profile && $rating->user->profile->profile_picture
                            ? asset($rating->user->profile->profile_picture)
                            : 'http://127.0.0.1:8000/images/pfp/default.png',
                        'user' => $rating->user ? [
                            'user_id' => $rating->user->user_id,
                            'username' => $rating->user->username,
                            'profile' => $rating->user->profile ? [
                                'first_name' => $rating->user->profile->first_name,
                                'middle_initial' => $rating->user->profile->middle_initial,
                                'last_name' => $rating->user->profile->last_name,
                                'profile_picture' => $rating->user->profile->profile_picture 
                                    ? asset($rating->user->profile->profile_picture) 
                                    : 'http://127.0.0.1:8000/images/pfp/default.png',
                            ] : null,
                        ] : null,
                    ];
                });

            Log::info('Fetched ratings for product', ['product_id' => $productId, 'ratings' => $ratings->toArray()]);

            return response()->json([
                'success' => true,
                'data' => $ratings,
            ], 200);
        } catch (\Exception $e) {
            Log::error('RateController: Failed to fetch ratings', [
                'error' => $e->getMessage(),
                'product_id' => $productId,
            ]);
            return response()->json([
                'success' => false,
                'error' => ['message' => 'Failed to fetch ratings']
            ], 500);
        }
    }
}