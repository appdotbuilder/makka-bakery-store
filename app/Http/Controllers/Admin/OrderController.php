<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the order status.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Order status updated successfully.');
    }
}