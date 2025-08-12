import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    total_price: number;
    product: {
        slug: string;
    };
    [key: string]: unknown;
}

interface User {
    name: string;
    email: string;
    [key: string]: unknown;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    total_amount: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string | null;
    delivery_method: string;
    notes: string | null;
    pickup_time: string | null;
    created_at: string;
    items: OrderItem[];
    user: User;
    [key: string]: unknown;
}

interface Props {
    order: Order;
    [key: string]: unknown;
}

export default function OrderShow({ order }: Props) {
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
            month: 'long',
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
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/orders">
                                <Button variant="outline" size="sm">
                                    ← Back to Orders
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Order #{order.order_number}
                                </h1>
                                <p className="text-gray-600">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
                                {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {order.items.map((item, index) => (
                                        <div key={item.id} className={`p-6 ${index > 0 ? 'border-t' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1">
                                                        {item.product_name}
                                                    </h3>
                                                    <div className="text-gray-600 text-sm">
                                                        ${item.product_price} × {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-lg">
                                                        ${item.total_price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary & Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${order.tax_amount.toFixed(2)}</span>
                                    </div>
                                    {order.delivery_fee > 0 && (
                                        <div className="flex justify-between">
                                            <span>Delivery Fee:</span>
                                            <span>${order.delivery_fee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total:</span>
                                            <span className="text-orange-600">${order.total_amount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Delivery Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <strong>Method:</strong>
                                        <div className="mt-1">
                                            {order.delivery_method === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}
                                        </div>
                                    </div>
                                    
                                    {order.pickup_time && (
                                        <div>
                                            <strong>
                                                {order.delivery_method === 'delivery' ? 'Delivery Time:' : 'Pickup Time:'}
                                            </strong>
                                            <div className="mt-1">
                                                📅 {formatDate(order.pickup_time)}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {order.delivery_address && (
                                        <div>
                                            <strong>Delivery Address:</strong>
                                            <div className="mt-1 text-sm">
                                                {order.delivery_address}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <strong>Name:</strong>
                                        <div className="mt-1">{order.customer_name}</div>
                                    </div>
                                    <div>
                                        <strong>Email:</strong>
                                        <div className="mt-1">{order.customer_email}</div>
                                    </div>
                                    <div>
                                        <strong>Phone:</strong>
                                        <div className="mt-1">{order.customer_phone}</div>
                                    </div>
                                    
                                    {order.notes && (
                                        <div>
                                            <strong>Special Notes:</strong>
                                            <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
                                                {order.notes}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Link href="/products">
                                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                        🛍️ Order Again
                                    </Button>
                                </Link>
                                
                                <div className="text-center text-sm text-gray-500">
                                    <p>📞 Questions? Call (555) 123-CAKE</p>
                                    <p>📧 Email: orders@makkabakery.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}