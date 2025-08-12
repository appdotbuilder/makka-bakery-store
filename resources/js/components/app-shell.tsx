import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { props } = usePage<SharedData>();
    const { auth } = props;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2">
                                <span className="text-2xl">🥖</span>
                                <span className="text-xl font-bold text-gray-900">Makka Bakery</span>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                                    Home
                                </Link>
                                <Link href="/products" className="text-gray-600 hover:text-orange-600 transition-colors">
                                    Products
                                </Link>
                                <Link href="/cart" className="text-gray-600 hover:text-orange-600 transition-colors">
                                    🛒 Cart
                                </Link>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-3">
                                {auth?.user ? (
                                    <>
                                        <Link href="/dashboard">
                                            <Button variant="ghost" size="sm">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href="/settings/profile" method="get">
                                            <Button variant="ghost" size="sm">
                                                {auth.user.name}
                                            </Button>
                                        </Link>
                                        <Link href="/logout" method="post">
                                            <Button variant="outline" size="sm">
                                                Logout
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="ghost" size="sm">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="text-2xl">🥖</span>
                                    <span className="text-xl font-bold">Makka Bakery</span>
                                </div>
                                <p className="text-gray-400">
                                    Fresh baked goods made with love daily. Traditional recipes, modern quality.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li><Link href="/products" className="hover:text-white">Products</Link></li>
                                    <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
                                    {auth?.user ? (
                                        <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                                    ) : (
                                        <>
                                            <li><Link href="/login" className="hover:text-white">Login</Link></li>
                                            <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold mb-4">Contact Info</h3>
                                <div className="space-y-2 text-gray-400">
                                    <p>📞 (555) 123-CAKE</p>
                                    <p>📧 hello@makkabakery.com</p>
                                    <p>📍 123 Bakery Street, City, State</p>
                                    <p>🕒 Mon-Sat: 6AM-8PM, Sun: 7AM-6PM</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 Makka Bakery. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={props.sidebarOpen}>{children}</SidebarProvider>;
}
