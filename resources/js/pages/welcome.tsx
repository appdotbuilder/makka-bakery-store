import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string | null;
    category: {
        name: string;
    };
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    [key: string]: unknown;
}

interface Props {
    featuredProducts: Product[];
    categories: Category[];
    auth?: {
        user: {
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ featuredProducts, categories, auth }: Props) {
    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-orange-100 to-amber-50 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mb-8">
                            <span className="text-6xl">🥖</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to Makka Bakery
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Fresh baked goods made with love daily. From artisan breads to custom cakes, 
                            we bring you the finest bakery experience with traditional recipes and modern quality.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                                    🛍️ Shop Now
                                </Button>
                            </Link>
                            {!auth?.user && (
                                <Link href="/register">
                                    <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3">
                                        📝 Create Account
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-4">
                            🍞 Our Categories
                        </h2>
                        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Explore our wide range of freshly baked goods, from daily essentials to special treats
                        </p>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <Link key={category.id} href={`/products?category=${category.slug}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-4xl mb-4">
                                                {category.name === 'Fresh Bread' && '🍞'}
                                                {category.name === 'Cakes & Cupcakes' && '🎂'}
                                                {category.name === 'Pastries' && '🥐'}
                                                {category.name === 'Cookies' && '🍪'}
                                                {category.name === 'Seasonal Specials' && '🌟'}
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {category.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <div className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-4">
                                ⭐ Featured Products
                            </h2>
                            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                                Our most popular items, loved by customers and baked fresh daily
                            </p>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredProducts.slice(0, 6).map((product) => (
                                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                    {product.category.name}
                                                </Badge>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Featured
                                                </Badge>
                                            </div>
                                            
                                            <h3 className="text-lg font-semibold mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-orange-600">
                                                    ${product.price}
                                                </span>
                                                <Link href={`/products/${product.slug}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            
                            <div className="text-center mt-8">
                                <Link href="/products">
                                    <Button className="bg-orange-600 hover:bg-orange-700">
                                        View All Products
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section */}
                <div className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            ✨ Why Choose Makka Bakery?
                        </h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🌱</div>
                                <h3 className="font-semibold mb-2">Fresh Ingredients</h3>
                                <p className="text-sm text-gray-600">
                                    We use only the finest, freshest ingredients sourced locally when possible
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-4xl mb-4">👨‍🍳</div>
                                <h3 className="font-semibold mb-2">Expert Bakers</h3>
                                <p className="text-sm text-gray-600">
                                    Our skilled bakers bring years of experience and passion to every item
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="font-semibold mb-2">Online Ordering</h3>
                                <p className="text-sm text-gray-600">
                                    Easy online ordering with pickup and delivery options available
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="font-semibold mb-2">Custom Orders</h3>
                                <p className="text-sm text-gray-600">
                                    Special occasion cakes and custom orders for your important events
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-16 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Order? 🛒
                        </h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust Makka Bakery for their daily bread and special occasions
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                                    🛍️ Browse Products
                                </Button>
                            </Link>
                            {!auth?.user ? (
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3">
                                        🔑 Sign In
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3">
                                        📋 My Orders
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}