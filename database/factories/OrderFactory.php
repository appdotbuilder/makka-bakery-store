<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10.00, 100.00);
        $taxRate = 0.08; // 8% tax
        $taxAmount = $subtotal * $taxRate;
        $deliveryFee = fake()->randomElement([0, 2.50, 5.00]);
        $totalAmount = $subtotal + $taxAmount + $deliveryFee;

        return [
            'order_number' => Order::generateOrderNumber(),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'preparing', 'ready', 'completed']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'delivery_address' => fake()->boolean(30) ? fake()->address() : null,
            'delivery_method' => fake()->randomElement(['pickup', 'delivery']),
            'delivery_fee' => $deliveryFee,
            'notes' => fake()->boolean(40) ? fake()->sentence() : null,
            'pickup_time' => fake()->dateTimeBetween('now', '+1 week'),
        ];
    }
}