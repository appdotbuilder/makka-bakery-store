<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        $products = $query->latest()->paginate(10)->withQueryString();
        $categories = Category::all();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'category_id' => $request->category_id,
            'is_active' => $request->is_active ?? true,
            'is_featured' => $request->is_featured ?? false,
            'weight' => $request->weight,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load('category');

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the product.
     */
    public function edit(Product $product)
    {
        $product->load('category');
        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'category_id' => $request->category_id,
            'is_active' => $request->is_active ?? true,
            'is_featured' => $request->is_featured ?? false,
            'weight' => $request->weight,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}