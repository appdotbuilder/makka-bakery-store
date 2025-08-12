<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show the checkout form.
     */
    public function index()
    {
        $cart = $this->getCart();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cart->load(['items.product']);

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Process the checkout.
     */
    public function store(StoreOrderRequest $request)
    {
        $cart = $this->getCart();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cart->load(['items.product']);

        // Calculate totals
        $subtotal = $cart->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        $taxRate = 0.08; // 8% tax
        $taxAmount = $subtotal * $taxRate;
        $deliveryFee = $request->delivery_method === 'delivery' ? 5.00 : 0;
        $totalAmount = $subtotal + $taxAmount + $deliveryFee;

        // Create order
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'user_id' => auth()->id(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'delivery_address' => $request->delivery_address,
            'delivery_method' => $request->delivery_method,
            'delivery_fee' => $deliveryFee,
            'notes' => $request->notes,
            'pickup_time' => $request->pickup_time,
        ]);

        // Create order items
        foreach ($cart->items as $cartItem) {
            $order->items()->create([
                'product_id' => $cartItem->product_id,
                'product_name' => $cartItem->product->name,
                'product_price' => $cartItem->price,
                'quantity' => $cartItem->quantity,
                'total_price' => $cartItem->price * $cartItem->quantity,
            ]);

            // Update product stock
            $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
        }

        // Clear cart
        $cart->items()->delete();

        return redirect()->route('orders.show', $order)->with('success', 'Order placed successfully!');
    }

    /**
     * Get cart for current user/session.
     */
    protected function getCart(): ?Cart
    {
        if (auth()->check()) {
            return Cart::where('user_id', auth()->id())->with('items.product')->first();
        } else {
            return Cart::where('session_id', session()->getId())->with('items.product')->first();
        }
    }
}