import React from 'react';
import { router, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string | null;
    stock_quantity: number;
    category: {
        name: string;
        slug: string;
    };
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    [key: string]: unknown;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = React.useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', {
            search: searchTerm || undefined,
            category: selectedCategory || undefined,
        });
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        router.get('/products', {
            search: searchTerm || undefined,
            category: value || undefined,
        });
    };

    const addToCart = (productId: number) => {
        router.post('/cart', {
            product_id: productId,
            quantity: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            🛍️ Our Products
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Discover our wide selection of freshly baked goods, made with love daily
                        </p>

                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" variant="outline">
                                    Search
                                </Button>
                            </form>
                            
                            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.slug}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Filters */}
                        {(filters.category || filters.search) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {filters.category && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Category: {categories.find(c => c.slug === filters.category)?.name}
                                        <button
                                            onClick={() => handleCategoryChange('')}
                                            className="ml-1 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                {filters.search && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Search: "{filters.search}"
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                router.get('/products', { category: selectedCategory || undefined });
                                            }}
                                            className="ml-1 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-4 py-8">
                    {products.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.data.map((product) => (
                                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {product.category.name}
                                                </Badge>
                                                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Low Stock
                                                    </Badge>
                                                )}
                                                {product.stock_quantity === 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Out of Stock
                                                    </Badge>
                                                )}
                                            </div>

                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-semibold mb-2 hover:text-orange-600 cursor-pointer">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-orange-600">
                                                    ${product.price}
                                                </span>
                                                
                                                <div className="flex gap-2">
                                                    <Link href={`/products/${product.slug}`}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    
                                                    {product.stock_quantity > 0 ? (
                                                        <Button 
                                                            size="sm"
                                                            onClick={() => addToCart(product.id)}
                                                            className="bg-orange-600 hover:bg-orange-700"
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" disabled>
                                                            Out of Stock
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="flex justify-center gap-2">
                                    {products.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
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
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-600 mb-4">
                                {filters.search || filters.category 
                                    ? 'Try adjusting your search or filters' 
                                    : 'No products are currently available'
                                }
                            </p>
                            {(filters.search || filters.category) && (
                                <Link href="/products">
                                    <Button variant="outline">Clear Filters</Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}