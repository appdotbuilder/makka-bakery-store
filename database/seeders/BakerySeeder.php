<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BakerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@makkabakery.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0123',
            'address' => '123 Bakery Street, City, State 12345',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Create regular test user
        $user = User::create([
            'name' => 'John Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'phone' => '+1-555-0456',
            'address' => '456 Customer Ave, City, State 12345',
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        // Create categories
        $categories = [
            [
                'name' => 'Fresh Bread',
                'description' => 'Daily baked fresh bread loaves and rolls'
            ],
            [
                'name' => 'Cakes & Cupcakes',
                'description' => 'Custom cakes and delicious cupcakes for any occasion'
            ],
            [
                'name' => 'Pastries',
                'description' => 'Flaky, buttery pastries and breakfast items'
            ],
            [
                'name' => 'Cookies',
                'description' => 'Fresh baked cookies and sweet treats'
            ],
            [
                'name' => 'Seasonal Specials',
                'description' => 'Limited time seasonal and holiday items'
            ]
        ];

        $createdCategories = [];
        foreach ($categories as $index => $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
            $createdCategories[] = $category;
        }

        // Create products for each category
        $products = [
            'Fresh Bread' => [
                ['name' => 'Sourdough Loaf', 'price' => 6.50, 'ingredients' => 'Sourdough starter, flour, water, salt', 'weight' => 800],
                ['name' => 'Whole Wheat Bread', 'price' => 5.50, 'ingredients' => 'Whole wheat flour, yeast, honey, salt', 'weight' => 750],
                ['name' => 'French Baguette', 'price' => 4.00, 'ingredients' => 'Bread flour, water, yeast, salt', 'weight' => 400],
                ['name' => 'Rye Bread', 'price' => 6.00, 'ingredients' => 'Rye flour, bread flour, caraway seeds, yeast', 'weight' => 700],
                ['name' => 'Dinner Rolls (6 pack)', 'price' => 4.50, 'ingredients' => 'Flour, milk, butter, yeast, sugar', 'weight' => 300],
            ],
            'Cakes & Cupcakes' => [
                ['name' => 'Chocolate Layer Cake', 'price' => 24.99, 'ingredients' => 'Chocolate, flour, eggs, butter, sugar', 'weight' => 1200],
                ['name' => 'Red Velvet Cake', 'price' => 26.99, 'ingredients' => 'Cocoa, flour, buttermilk, cream cheese', 'weight' => 1100],
                ['name' => 'Carrot Cake', 'price' => 22.99, 'ingredients' => 'Carrots, walnuts, cinnamon, cream cheese frosting', 'weight' => 1000],
                ['name' => 'Vanilla Cupcakes (12 pack)', 'price' => 18.99, 'ingredients' => 'Vanilla, flour, eggs, butter, buttercream', 'weight' => 800],
                ['name' => 'Lemon Cake', 'price' => 21.99, 'ingredients' => 'Fresh lemons, flour, eggs, butter, sugar', 'weight' => 900],
            ],
            'Pastries' => [
                ['name' => 'Butter Croissant', 'price' => 3.50, 'ingredients' => 'Butter, flour, yeast, eggs', 'weight' => 80],
                ['name' => 'Pain au Chocolat', 'price' => 4.00, 'ingredients' => 'Croissant dough, dark chocolate', 'weight' => 90],
                ['name' => 'Apple Danish', 'price' => 4.25, 'ingredients' => 'Puff pastry, apples, cinnamon, custard', 'weight' => 120],
                ['name' => 'Chocolate Éclair', 'price' => 4.75, 'ingredients' => 'Choux pastry, pastry cream, chocolate glaze', 'weight' => 100],
                ['name' => 'Almond Croissant', 'price' => 4.50, 'ingredients' => 'Croissant, almond cream, sliced almonds', 'weight' => 110],
            ],
            'Cookies' => [
                ['name' => 'Chocolate Chip Cookies (6 pack)', 'price' => 8.99, 'ingredients' => 'Chocolate chips, flour, butter, brown sugar', 'weight' => 300],
                ['name' => 'Oatmeal Raisin Cookies (6 pack)', 'price' => 8.99, 'ingredients' => 'Oats, raisins, cinnamon, brown sugar', 'weight' => 320],
                ['name' => 'Sugar Cookies (6 pack)', 'price' => 7.99, 'ingredients' => 'Flour, butter, sugar, vanilla, eggs', 'weight' => 280],
                ['name' => 'Double Chocolate Cookies (6 pack)', 'price' => 9.99, 'ingredients' => 'Cocoa, chocolate chips, flour, butter', 'weight' => 340],
                ['name' => 'Snickerdoodles (6 pack)', 'price' => 8.49, 'ingredients' => 'Flour, butter, cinnamon, cream of tartar', 'weight' => 290],
            ],
            'Seasonal Specials' => [
                ['name' => 'Pumpkin Spice Loaf', 'price' => 12.99, 'ingredients' => 'Pumpkin, cinnamon, nutmeg, flour, eggs', 'weight' => 600],
                ['name' => 'Gingerbread Cookies (12 pack)', 'price' => 15.99, 'ingredients' => 'Molasses, ginger, cinnamon, flour', 'weight' => 400],
                ['name' => 'Hot Cross Buns (6 pack)', 'price' => 9.99, 'ingredients' => 'Flour, currants, spices, orange zest', 'weight' => 450],
            ]
        ];

        foreach ($createdCategories as $category) {
            if (isset($products[$category->name])) {
                foreach ($products[$category->name] as $productData) {
                    Product::create([
                        'name' => $productData['name'],
                        'slug' => Str::slug($productData['name']),
                        'description' => "Freshly made {$productData['name']} from Makka Bakery. Made with the finest ingredients and traditional techniques.",
                        'ingredients' => $productData['ingredients'],
                        'price' => $productData['price'],
                        'stock_quantity' => random_int(5, 25),
                        'category_id' => $category->id,
                        'is_active' => true,
                        'is_featured' => random_int(1, 100) <= 20, // 20% featured
                        'weight' => $productData['weight'],
                        'status' => 'available',
                    ]);
                }
            }
        }
    }
}