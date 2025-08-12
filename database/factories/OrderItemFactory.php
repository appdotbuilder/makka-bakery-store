<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 5);
        $price = fake()->randomFloat(2, 2.50, 25.00);
        $totalPrice = $price * $quantity;

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name' => fake()->randomElement([
                'Sourdough Loaf', 'Chocolate Cake', 'Croissant', 'Chocolate Chip Cookies'
            ]),
            'product_price' => $price,
            'quantity' => $quantity,
            'total_price' => $totalPrice,
        ];
    }
}