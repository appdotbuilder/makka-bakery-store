<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Sales statistics
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $todayRevenue = Order::where('status', '!=', 'cancelled')
            ->whereDate('created_at', today())
            ->sum('total_amount');
        
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalProducts = Product::active()->count();
        $lowStockProducts = Product::where('stock_quantity', '<', 5)->count();
        $totalCustomers = User::where('is_admin', false)->count();

        // Recent orders
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get();

        // Top products
        $topProducts = Product::withCount(['orderItems' => function ($query) {
            $query->whereHas('order', function ($q) {
                $q->where('status', '!=', 'cancelled');
            });
        }])
            ->orderByDesc('order_items_count')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'today_revenue' => $todayRevenue,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'total_customers' => $totalCustomers,
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
        ]);
    }
}