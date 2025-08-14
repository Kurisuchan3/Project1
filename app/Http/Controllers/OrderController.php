<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentDetail;
use App\Models\Status;
use App\Models\User;
use App\Models\Notification;
use App\Models\NotificationMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Create a notification for the user based on the order's status
     */
    private function createNotification($userId, $orderId, $statusId)
    {
        try {
            Log::info('Attempting to create notification', [
                'user_id' => $userId,
                'order_id' => $orderId,
                'status_id' => $statusId,
            ]);

            $notificationMessage = NotificationMessage::where('status_id', $statusId)->first();
            if (!$notificationMessage) {
                Log::warning('No notification message found for status_id', ['status_id' => $statusId]);
                return;
            }

            $notification = Notification::create([
                'user_id' => $userId,
                'order_id' => $orderId,
                'message' => $notificationMessage->message_template,
                'is_read' => false,
            ]);

            Log::info('Notification created successfully', [
                'notification_id' => $notification->id,
                'message' => $notification->message,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create notification', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'order_id' => $orderId,
                'status_id' => $statusId,
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'billingDetails' => 'required|array',
            'billingDetails.barangay' => 'required|string',
            'billingDetails.city' => 'required|string',
            'billingDetails.province' => 'required|string',
            'billingDetails.country' => 'required|string',
            'cartItems' => 'required|array|min:1',
            'cartItems.*.id' => 'required|exists:products,id',
            'cartItems.*.quantity' => 'required|integer|min:1',
            'cartItems.*.price' => 'required|numeric|min:0',
            'payment_method' => 'required|in:credit_card,cod,gcash',
            'payment_details' => 'required_if:payment_method,credit_card,gcash|array',
        ]);

        try {
            DB::beginTransaction();

            $user = Auth::user();
            Log::info('Auth user check', [
                'user' => $user ? $user->toArray() : null,
                'auth_id' => Auth::id(),
                'token' => $request->bearerToken(),
            ]);

            if (!$user) {
                throw new \Exception('User not authenticated');
            }

            $billingDetails = $request->billingDetails;
            $cartItems = $request->cartItems;
            $paymentMethod = $request->payment_method;
            $paymentDetailsData = $request->payment_details ?? [];

            $subtotal = array_sum(array_map(function ($item) {
                return $item['price'] * $item['quantity'];
            }, $cartItems));
            $shippingFee = 80.00;
            $total = $subtotal + $shippingFee;

            $order = Order::create([
                'user_id' => $user->user_id,
                'address_id' => $billingDetails['address_id'] ?? null,
                'barangay' => $billingDetails['barangay'],
                'city' => $billingDetails['city'],
                'province' => $billingDetails['province'],
                'country' => $billingDetails['country'],
                'order_notes' => $billingDetails['orderNotes'] ?? null,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'status_id' => Status::where('status_name', 'Pending')->first()->id,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                \App\Models\CartItem::where('user_id', $user->user_id)
                    ->where('product_id', $item['id'])
                    ->where('quantity', $item['quantity'])
                    ->delete();
            }

            PaymentDetail::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'details' => $paymentDetailsData,
            ]);

            // Create notification for the new order
            $this->createNotification($user->user_id, $order->id, $order->status_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order->load(['orderItems.product', 'status', 'paymentDetail']),
                'message' => 'Order placed successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['orderItems.product', 'status', 'paymentDetail', 'user.profile'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function adminIndex()
    {
        $user = Auth::user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $orders = Order::with(['orderItems.product', 'status', 'paymentDetail', 'user.profile'])
            ->get();

        Log::info('Admin orders fetched', ['orders_count' => $orders->count()]);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->where('id', $id)
            ->with(['orderItems.product', 'status', 'paymentDetail', 'user.profile'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:statuses,id',
        ]);

        $user = Auth::user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $order = Order::findOrFail($id);
        Log::info('Updating order status', [
            'order_id' => $id,
            'new_status_id' => $request->status_id,
            'user_id' => $order->user_id,
        ]);

        $order->update(['status_id' => $request->status_id]);

        // Create notification for status update
        $this->createNotification($order->user_id, $order->id, $request->status_id);

        return response()->json([
            'success' => true,
            'data' => $order->load('status'),
            'message' => 'Status updated successfully',
        ]);
    }
}