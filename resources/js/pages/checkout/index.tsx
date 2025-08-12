import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        category: {
            name: string;
        };
    };
    subtotal: number;
    [key: string]: unknown;
}

interface Cart {
    id: number;
    items: CartItem[];
    total: number;
    [key: string]: unknown;
}

interface User {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    [key: string]: unknown;
}

interface CheckoutFormData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_method: string;
    delivery_address: string;
    pickup_time: string;
    notes: string;
    [key: string]: string;
}

interface Props {
    cart: Cart;
    user: User | null;
    [key: string]: unknown;
}

export default function CheckoutIndex({ cart, user }: Props) {
    const { data, setData, post, processing, errors } = useForm<CheckoutFormData>({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        delivery_method: 'pickup',
        delivery_address: user?.address || '',
        pickup_time: '',
        notes: '',
    });

    const subtotal = cart.total;
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = data.delivery_method === 'delivery' ? 5.00 : 0;
    const total = subtotal + tax + deliveryFee;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    // Generate time slots for next 7 days
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(now.getDate() + i);
            
            // Skip if it's today and already past 2 PM
            if (i === 0 && now.getHours() >= 14) {
                continue;
            }
            
            const dateStr = date.toISOString().split('T')[0];
            
            // Morning slots (8 AM - 12 PM)
            for (let hour = 8; hour <= 11; hour++) {
                const time = `${dateStr}T${hour.toString().padStart(2, '0')}:00`;
                const displayTime = new Date(time).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
                slots.push({ value: time, label: displayTime });
            }
            
            // Afternoon slots (2 PM - 6 PM)
            for (let hour = 14; hour <= 17; hour++) {
                const time = `${dateStr}T${hour.toString().padStart(2, '0')}:00`;
                const displayTime = new Date(time).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric', 
                    hour: 'numeric',
                    minute: '2-digit'
                });
                slots.push({ value: time, label: displayTime });
            }
        }
        
        return slots;
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🚀 Checkout
                        </h1>
                        <p className="text-gray-600">
                            Complete your order for fresh baked goods from Makka Bakery
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Customer Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>👤 Customer Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="customer_name">Full Name *</Label>
                                            <Input
                                                id="customer_name"
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className={errors.customer_name ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.customer_name && (
                                                <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_email">Email Address *</Label>
                                            <Input
                                                id="customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                className={errors.customer_email ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.customer_email && (
                                                <p className="text-red-600 text-sm mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_phone">Phone Number *</Label>
                                            <Input
                                                id="customer_phone"
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className={errors.customer_phone ? 'border-red-500' : ''}
                                                placeholder="(555) 123-4567"
                                                required
                                            />
                                            {errors.customer_phone && (
                                                <p className="text-red-600 text-sm mt-1">{errors.customer_phone}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Delivery Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>🚚 Delivery Method</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Select 
                                            value={data.delivery_method} 
                                            onValueChange={(value) => setData('delivery_method', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pickup">
                                                    📦 Pickup - Free
                                                </SelectItem>
                                                <SelectItem value="delivery">
                                                    🚚 Delivery - $5.00
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {data.delivery_method === 'delivery' && (
                                            <div>
                                                <Label htmlFor="delivery_address">Delivery Address *</Label>
                                                <Textarea
                                                    id="delivery_address"
                                                    value={data.delivery_address}
                                                    onChange={(e) => setData('delivery_address', e.target.value)}
                                                    className={errors.delivery_address ? 'border-red-500' : ''}
                                                    placeholder="Enter your full delivery address..."
                                                    rows={3}
                                                />
                                                {errors.delivery_address && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.delivery_address}</p>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="pickup_time">
                                                {data.delivery_method === 'delivery' ? 'Delivery Time' : 'Pickup Time'} *
                                            </Label>
                                            <Select 
                                                value={data.pickup_time} 
                                                onValueChange={(value) => setData('pickup_time', value)}
                                            >
                                                <SelectTrigger className={errors.pickup_time ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select a time..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {generateTimeSlots().map((slot) => (
                                                        <SelectItem key={slot.value} value={slot.value}>
                                                            {slot.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.pickup_time && (
                                                <p className="text-red-600 text-sm mt-1">{errors.pickup_time}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">Special Notes (optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Any special instructions for your order..."
                                                rows={2}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-4">
                                    <CardHeader>
                                        <CardTitle>📋 Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Order Items */}
                                        <div className="space-y-3">
                                            {cart.items.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <div>
                                                        <div className="font-medium">{item.product.name}</div>
                                                        <div className="text-gray-500">
                                                            ${item.price} × {item.quantity}
                                                        </div>
                                                        <Badge variant="outline" className="text-xs mt-1">
                                                            {item.product.category.name}
                                                        </Badge>
                                                    </div>
                                                    <div className="font-medium">
                                                        ${item.subtotal.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal:</span>
                                                <span>${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Tax (8%):</span>
                                                <span>${tax.toFixed(2)}</span>
                                            </div>
                                            {deliveryFee > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span>Delivery Fee:</span>
                                                    <span>${deliveryFee.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2">
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span>Total:</span>
                                                    <span className="text-orange-600">${total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-orange-600 hover:bg-orange-700 mt-6"
                                        >
                                            {processing ? 'Processing...' : '🎉 Place Order'}
                                        </Button>

                                        <div className="text-xs text-gray-500 text-center space-y-1">
                                            <p>📞 Questions? Call (555) 123-CAKE</p>
                                            <p>🔒 Secure checkout</p>
                                            <p>💳 Payment on pickup/delivery</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}