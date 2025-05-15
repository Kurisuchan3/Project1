<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Get all ratings for a specific product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProductRatings(Request $request, $productId)
    {
        try {
            $ratings = Rating::where('product_id', $productId)
                ->with([
                    'user.profile' => function ($query) {
                        $query->select('id', 'user_id', 'first_name', 'middle_initial', 'last_name', 'profile_picture');
                    }
                ])
                ->select('id', 'product_id', 'user_id', 'rating', 'comment', 'photo', 'created_at', 'updated_at')
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
                            'user_id' => $rating->user->id,
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
            Log::error('ReviewController: Failed to fetch ratings', [
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