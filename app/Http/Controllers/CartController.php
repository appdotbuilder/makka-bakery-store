<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index()
    {
        $cart = $this->getOrCreateCart();
        $cart->load(['items.product.category']);

        return Inertia::render('cart/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        if (!$product->is_active || $product->status !== 'available') {
            return back()->with('error', 'This product is not available.');
        }

        if ($product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cart = $this->getOrCreateCart();
        
        /** @var \App\Models\CartItem|null $cartItem */
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $newQuantity = (int) $cartItem->quantity + $request->quantity;
            if ($newQuantity > $product->stock_quantity) {
                return back()->with('error', 'Not enough stock available.');
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ]);
        }

        return back()->with('success', 'Item added to cart!');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->getOrCreateCart();
        
        if ($cartItem->cart_id !== $cart->id) {
            return back()->with('error', 'Invalid cart item.');
        }

        if ($cartItem->product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated!');
    }

    /**
     * Remove item from cart.
     */
    public function destroy(CartItem $cartItem)
    {
        $cart = $this->getOrCreateCart();
        
        if ($cartItem->cart_id !== $cart->id) {
            return back()->with('error', 'Invalid cart item.');
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart!');
    }

    /**
     * Get or create cart for current user/session.
     */
    protected function getOrCreateCart(): Cart
    {
        if (auth()->check()) {
            return Cart::firstOrCreate(['user_id' => auth()->id()]);
        } else {
            return Cart::firstOrCreate(['session_id' => session()->getId()]);
        }
    }
}