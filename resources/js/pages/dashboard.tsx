import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    product_price: number;
    total_price: number;
    [key: string]: unknown;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    pickup_time: string | null;
    delivery_method: string;
    items: OrderItem[];
    [key: string]: unknown;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    orders: {
        data: Order[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Dashboard({ orders, auth }: Props) {
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
            pending: '⏳',
            confirmed: '✅',
            preparing: '👨‍🍳',
            ready: '📦',
            completed: '🎉',
            cancelled: '❌',
        };
        return icons[status] || '📋';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            👋 Welcome back, {auth.user.name}!
                        </h1>
                        <p className="text-gray-600">
                            Here's your order history from Makka Bakery
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <Link href="/products">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl mb-2">🛍️</div>
                                    <h3 className="font-semibold">Browse Products</h3>
                                    <p className="text-sm text-gray-600">Discover fresh baked goods</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/cart">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl mb-2">🛒</div>
                                    <h3 className="font-semibold">View Cart</h3>
                                    <p className="text-sm text-gray-600">Check your current items</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/settings/profile">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl mb-2">⚙️</div>
                                    <h3 className="font-semibold">Account Settings</h3>
                                    <p className="text-sm text-gray-600">Manage your profile</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Orders Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">📋 Your Orders</CardTitle>
                                <Link href="/orders">
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {orders.data.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.data.slice(0, 5).map((order) => (
                                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold">
                                                            Order #{order.order_number}
                                                        </h3>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>📅 Ordered: {formatDate(order.created_at)}</p>
                                                        {order.pickup_time && (
                                                            <p>
                                                                {order.delivery_method === 'delivery' ? '🚚' : '📦'} 
                                                                {order.delivery_method === 'delivery' ? ' Delivery' : ' Pickup'}: {formatDate(order.pickup_time)}
                                                            </p>
                                                        )}
                                                        <p>🧾 Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-lg font-semibold text-orange-600">
                                                            ${order.total_amount}
                                                        </div>
                                                    </div>
                                                    
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🍞</div>
                                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                                    <p className="text-gray-600 mb-4">
                                        Ready to taste our delicious baked goods?
                                    </p>
                                    <Link href="/products">
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            Start Shopping
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <div className="mt-8 text-center">
                        <div className="bg-orange-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2">
                                🎉 Thank you for choosing Makka Bakery!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Fresh baked goods made with love, delivered to your door or ready for pickup.
                            </p>
                            <div className="text-sm text-gray-500">
                                📞 Questions? Call us at (555) 123-CAKE<br/>
                                🕒 Orders placed before 2 PM ready same day
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}