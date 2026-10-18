<?php

namespace Database\Factories;

use App\Models\Professional;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Professional>
 */
class ProfessionalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'service' => fake()->randomElement(['Electricidad', 'Plomería', 'Pintura']),
            'description' => fake()->sentence(),
            'neighborhood' => fake()->randomElement(['Villa Morra', 'Recoleta', 'Sajonia']),
            'rating' => fake()->randomFloat(1, 3.5, 5),
        ];
    }
}
