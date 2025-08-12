import React from 'react';
import { router, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    ingredients: string | null;
    price: number;
    stock_quantity: number;
    weight: number | null;
    image: string | null;
    category: {
        name: string;
        slug: string;
    };
    [key: string]: unknown;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = React.useState(1);

    const addToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity <= 5 && product.stock_quantity > 0;

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white py-4">
                    <div className="container mx-auto px-4">
                        <nav className="text-sm text-gray-600">
                            <Link href="/" className="hover:text-orange-600">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/products" className="hover:text-orange-600">Products</Link>
                            <span className="mx-2">/</span>
                            <Link href={`/products?category=${product.category.slug}`} className="hover:text-orange-600">
                                {product.category.name}
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg flex items-center justify-center">
                                    <div className="text-8xl">
                                        {product.category.name === 'Fresh Bread' && '🍞'}
                                        {product.category.name === 'Cakes & Cupcakes' && '🎂'}
                                        {product.category.name === 'Pastries' && '🥐'}
                                        {product.category.name === 'Cookies' && '🍪'}
                                        {product.category.name === 'Seasonal Specials' && '🌟'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="lg:col-span-1">
                            <div className="mb-4">
                                <Badge variant="outline" className="mb-2">
                                    {product.category.name}
                                </Badge>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>
                                <div className="text-2xl font-bold text-orange-600 mb-6">
                                    ${product.price}
                                    {product.weight && (
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            ({product.weight}g)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {isOutOfStock ? (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                ) : isLowStock ? (
                                    <Badge variant="destructive">Only {product.stock_quantity} left</Badge>
                                ) : (
                                    <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Ingredients */}
                            {product.ingredients && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Ingredients</h3>
                                    <p className="text-gray-600">
                                        {product.ingredients}
                                    </p>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <label htmlFor="quantity" className="font-medium">Quantity:</label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </Button>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value);
                                                if (newQuantity > 0 && newQuantity <= product.stock_quantity) {
                                                    setQuantity(newQuantity);
                                                }
                                            }}
                                            className="w-16 text-center"
                                            min="1"
                                            max={product.stock_quantity}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                            disabled={quantity >= product.stock_quantity}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={addToCart}
                                        disabled={isOutOfStock}
                                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                                    >
                                        {isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
                                    </Button>
                                    
                                    <div className="text-sm text-gray-600 text-center">
                                        <p>📞 Questions? Call (555) 123-CAKE</p>
                                        <p>🕒 Orders before 2 PM ready same day</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold mb-8 text-center">
                                You Might Also Like
                            </h2>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg flex items-center justify-center mb-4">
                                                <div className="text-4xl">
                                                    {relatedProduct.category.name === 'Fresh Bread' && '🍞'}
                                                    {relatedProduct.category.name === 'Cakes & Cupcakes' && '🎂'}
                                                    {relatedProduct.category.name === 'Pastries' && '🥐'}
                                                    {relatedProduct.category.name === 'Cookies' && '🍪'}
                                                    {relatedProduct.category.name === 'Seasonal Specials' && '🌟'}
                                                </div>
                                            </div>

                                            <h3 className="font-semibold mb-2">
                                                {relatedProduct.name}
                                            </h3>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-orange-600">
                                                    ${relatedProduct.price}
                                                </span>
                                                <Link href={`/products/${relatedProduct.slug}`}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}