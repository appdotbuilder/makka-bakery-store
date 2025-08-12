<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Fresh Bread',
            'Cakes & Cupcakes',
            'Pastries',
            'Cookies',
            'Seasonal Specials',
            'Gluten-Free Options'
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(10),
            'image' => null,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}