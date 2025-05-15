<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Total Products
        $totalProducts = Product::whereNull('deleted_at')->count();
        $lastMonthProducts = Product::whereNull('deleted_at')
            ->where('created_at', '<', Carbon::now()->startOfMonth())
            ->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->count();
        $productChange = $lastMonthProducts > 0 
            ? round(($totalProducts - $lastMonthProducts) / $lastMonthProducts * 100) . '%'
            : '0%';

        // Total Users
        $totalUsers = User::whereNull('deleted_at')->count();
        $lastMonthUsers = User::whereNull('deleted_at')
            ->where('created_at', '<', Carbon::now()->startOfMonth())
            ->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->count();
        $userChange = $lastMonthUsers > 0 
            ? round(($totalUsers - $lastMonthUsers) / $lastMonthUsers * 100) . '%'
            : '0%';

        // Total Orders
        $totalOrders = Order::count();
        $lastMonthOrders = Order::where('created_at', '<', Carbon::now()->startOfMonth())
            ->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->count();
        $orderChange = $lastMonthOrders > 0 
            ? round(($totalOrders - $lastMonthOrders) / $lastMonthOrders * 100) . '%'
            : '0%';

        // Pending Orders
        $pendingOrders = Order::where('status_id', 1)->count();
        $lastMonthPending = Order::where('status_id', 1)
            ->where('created_at', '<', Carbon::now()->startOfMonth())
            ->where('created_at', '>=', Carbon::now()->subMonth()->startOfMonth())
            ->count();
        $pendingChange = $lastMonthPending > 0 
            ? round(($pendingOrders - $lastMonthPending) / $lastMonthPending * 100) . '%'
            : '0%';

        return response()->json([
            'cards' => [
                [
                    'title' => 'Total Products',
                    'value' => $totalProducts,
                    'change' => $productChange,
                    'up' => $totalProducts >= $lastMonthProducts,
                ],
                [
                    'title' => 'Total Users',
                    'value' => $totalUsers,
                    'change' => $userChange,
                    'up' => $totalUsers >= $lastMonthUsers,
                ],
                [
                    'title' => 'Total Orders',
                    'value' => $totalOrders,
                    'change' => $orderChange,
                    'up' => $totalOrders >= $lastMonthOrders,
                ],
                [
                    'title' => 'Pending Orders',
                    'value' => $pendingOrders,
                    'change' => $pendingChange,
                    'up' => $pendingOrders >= $lastMonthPending,
                ],
            ]
        ]);
    }

    public function getOrderStats()
    {
        // Get the current year
        $year = Carbon::now()->year; // 2025

        // Generate all months for the current year
        $months = collect(range(1, 12))->map(function ($month) use ($year) {
            return Carbon::create($year, $month, 1)->startOfMonth();
        });

        // Query orders grouped by month for the current year
        $orderCounts = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as orders')
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->pluck('orders', 'month');

        // Map months to chart data
        $data = $months->map(function ($month) use ($orderCounts) {
            $monthKey = $month->format('Y-m');
            return [
                'name' => $month->format('M Y'), // e.g., "Jan 2025"
                'orders' => $orderCounts->get($monthKey, 0),
            ];
        });

        return response()->json([
            'data' => $data->values()->toArray(),
        ]);
    }

    public function getRecentOrders()
    {
        try {
            $orders = Order::select(
                'orders.id',
                'orders.user_id',
                'orders.status_id',
                'orders.created_at',
                'orders.updated_at',
                'users.username'
            )
                ->join('users', 'orders.user_id', '=', 'users.user_id')
                ->leftJoin('statuses', 'orders.status_id', '=', 'statuses.id')
                ->orderBy('orders.created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orders->map(function ($order) {
                    // Fallback values if data is missing
                    $status = $order->status_id == 4 ? 'Completed' : ($order->status_id == 1 ? 'Pending' : 'Ongoing');
                    $name = $order->username ?? 'Unknown User';
                    $productName = 'N/A'; // Placeholder if no product data

                    return [
                        'id' => $order->id,
                        'product_id' => null, // No product link in orders table
                        'user_id' => $order->user_id,
                        'status' => $status,
                        'created_at' => $order->created_at->toIso8601String(),
                        'updated_at' => $order->updated_at->toIso8601String(),
                        'name' => $name,
                        'profile_picture' => null, // No profiles table
                        'product_name' => $productName,
                        'user' => [
                            'user_id' => $order->user_id,
                            'username' => $order->username ?? 'Unknown',
                            'profile' => [
                                'first_name' => null,
                                'middle_initial' => null,
                                'last_name' => null,
                                'profile_picture' => null,
                            ],
                        ],
                    ];
                })->toArray(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching recent orders: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent orders',
            ], 500);
        }
    }

    public function getRecentOrderItems()
    {
        try {
            $orderItems = OrderItem::select(
                'order_items.id',
                'order_items.order_id',
                'order_items.product_id',
                'order_items.quantity',
                'order_items.price',
                'order_items.subtotal',
                'order_items.created_at',
                'order_items.updated_at',
                'products.name as product_name',
                'users.username',
                'users.user_id',
                DB::raw('profiles.profile_picture as profile_picture'),
                DB::raw('profiles.first_name as first_name'),
                DB::raw('profiles.middle_initial as middle_initial'),
                DB::raw('profiles.last_name as last_name')
            )
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('users', 'orders.user_id', '=', 'users.user_id')
                ->leftJoin('profiles', 'users.user_id', '=', 'profiles.user_id')
                ->orderBy('order_items.created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orderItems->map(function ($item) {
                    $name = $item->username ?? 'Unknown User';
                    $productName = $item->product_name ?? 'N/A';
                    $defaultProfilePicture = 'http://127.0.0.1:8000/images/pfp/default.png';

                    return [
                        'id' => $item->id,
                        'order_id' => $item->order_id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->subtotal,
                        'created_at' => $item->created_at ? $item->created_at->toIso8601String() : null,
                        'updated_at' => $item->updated_at ? $item->updated_at->toIso8601String() : null,
                        'product_name' => $productName,
                        'name' => $name,
                        'profile_picture' => $item->profile_picture ? asset($item->profile_picture) : $defaultProfilePicture,
                        'user' => [
                            'user_id' => $item->user_id ?? null,
                            'username' => $item->username ?? 'Unknown',
                            'profile' => [
                                'first_name' => $item->first_name ?? null,
                                'middle_initial' => $item->middle_initial ?? null,
                                'last_name' => $item->last_name ?? null,
                                'profile_picture' => $item->profile_picture ? asset($item->profile_picture) : $defaultProfilePicture,
                            ],
                        ],
                    ];
                })->toArray(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching recent order items: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent order items: ' . $e->getMessage(),
            ], 500);
        }
    }
}