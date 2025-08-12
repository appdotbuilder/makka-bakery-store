import React from 'react';
import { router, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock_quantity: number;
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

interface Props {
    cart: Cart | null;
    [key: string]: unknown;
}

export default function CartIndex({ cart }: Props) {
    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        
        router.put(`/cart/${itemId}`, { quantity }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const removeItem = (itemId: number) => {
        router.delete(`/cart/${itemId}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = cart?.total || 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🛒 Shopping Cart
                        </h1>
                        <p className="text-gray-600">
                            {totalItems > 0 ? `${totalItems} items in your cart` : 'Your cart is empty'}
                        </p>
                    </div>

                    {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven't added any delicious items to your cart yet.
                            </p>
                            <Link href="/products">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    🛍️ Browse Products
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Items in Cart</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {cart.items.map((item, index) => (
                                            <div key={item.id} className={`p-6 ${index > 0 ? 'border-t' : ''}`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">
                                                                    {item.product.name}
                                                                </h3>
                                                                <Badge variant="outline" className="text-xs mt-1">
                                                                    {item.product.category.name}
                                                                </Badge>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-lg font-semibold text-orange-600">
                                                                    ${item.price}
                                                                </span>
                                                                <span className="text-sm text-gray-500">each</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    −
                                                                </Button>
                                                                <Input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => {
                                                                        const newQuantity = parseInt(e.target.value);
                                                                        if (newQuantity > 0 && newQuantity <= item.product.stock_quantity) {
                                                                            updateQuantity(item.id, newQuantity);
                                                                        }
                                                                    }}
                                                                    className="w-16 text-center"
                                                                    min="1"
                                                                    max={item.product.stock_quantity}
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.product.stock_quantity}
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 text-right">
                                                            <span className="text-lg font-semibold">
                                                                ${item.subtotal.toFixed(2)}
                                                            </span>
                                                        </div>

                                                        {item.product.stock_quantity <= 5 && (
                                                            <div className="mt-2">
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Only {item.product.stock_quantity} left in stock
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-4">
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal ({totalItems} items):</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span>Tax (8%):</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total:</span>
                                                <span className="text-orange-600">${total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <Link href="/checkout">
                                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                                    🚀 Proceed to Checkout
                                                </Button>
                                            </Link>
                                            
                                            <Link href="/products">
                                                <Button variant="outline" className="w-full">
                                                    Continue Shopping
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="text-xs text-gray-500 text-center pt-4">
                                            <p>📞 Questions? Call us at (555) 123-CAKE</p>
                                            <p>🕒 Orders placed before 2 PM ready same day</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}