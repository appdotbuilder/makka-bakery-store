<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $breadProducts = [
            'Sourdough Loaf', 'Whole Wheat Bread', 'French Baguette', 'Rye Bread', 'Multigrain Bread'
        ];
        
        $cakeProducts = [
            'Chocolate Cake', 'Red Velvet Cake', 'Carrot Cake', 'Lemon Cake', 'Birthday Cake'
        ];
        
        $pastryProducts = [
            'Croissant', 'Danish Pastry', 'Éclair', 'Profiterole', 'Apple Turnover'
        ];
        
        $cookieProducts = [
            'Chocolate Chip Cookies', 'Oatmeal Cookies', 'Sugar Cookies', 'Snickerdoodles', 'Macarons'
        ];

        $allProducts = array_merge($breadProducts, $cakeProducts, $pastryProducts, $cookieProducts);
        $name = fake()->randomElement($allProducts);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(2),
            'ingredients' => fake()->randomElement([
                'Flour, Water, Yeast, Salt',
                'Flour, Sugar, Eggs, Butter, Vanilla',
                'Butter, Flour, Sugar, Eggs, Chocolate',
                'Oats, Flour, Sugar, Butter, Cinnamon'
            ]),
            'price' => fake()->randomFloat(2, 2.50, 25.00),
            'stock_quantity' => fake()->numberBetween(0, 50),
            'image' => null,
            'images' => null,
            'category_id' => Category::factory(),
            'is_active' => true,
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
            'weight' => fake()->randomFloat(2, 50, 1000), // Weight in grams
            'status' => fake()->randomElement(['available', 'out_of_stock']),
        ];
    }
}