<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display the store homepage.
     */
    public function index()
    {
        $featuredProducts = Product::with('category')
            ->active()
            ->available()
            ->featured()
            ->take(6)
            ->get();

        $categories = Category::active()
            ->orderBy('sort_order')
            ->get();

        $allProducts = Product::with('category')
            ->active()
            ->available()
            ->take(12)
            ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'allProducts' => $allProducts,
        ]);
    }
}