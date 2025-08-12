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
    [key: string]: unknown;
}

export default function OrdersIndex({ orders }: Props) {
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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📋 Your Orders
                        </h1>
                        <p className="text-gray-600">
                            Track your orders and view your order history
                        </p>
                    </div>

                    {orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Order #{order.order_number}
                                                </CardTitle>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(order.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-orange-600">
                                                    ${order.total_amount}
                                                </div>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm" className="mt-2">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">Order Details</h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p>
                                                        {order.delivery_method === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}
                                                    </p>
                                                    {order.pickup_time && (
                                                        <p>📅 {formatDate(order.pickup_time)}</p>
                                                    )}
                                                    <p>🧾 {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Items Ordered</h4>
                                                <div className="space-y-1">
                                                    {order.items.slice(0, 3).map((item) => (
                                                        <div key={item.id} className="text-sm text-gray-600">
                                                            {item.quantity}x {item.product_name}
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="text-sm text-gray-500">
                                                            +{order.items.length - 3} more items
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {orders.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (link.url) {
                                                    window.location.href = link.url;
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-orange-600 text-white'
                                                    : link.url
                                                    ? 'bg-white border hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                            <p className="text-gray-600 mb-6">
                                You haven't placed any orders yet. Start shopping to see your orders here!
                            </p>
                            <Link href="/products">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    🛍️ Browse Products
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}