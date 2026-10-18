<?php

namespace Database\Factories;

use App\Models\Professional;
use App\Models\ServiceRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceRequest>
 */
class ServiceRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'professional_id' => Professional::factory(),
            'customer_name' => 'Cliente de prueba',
            'contact_phone' => '0981000000',
            'description' => fake()->sentence(),
            'neighborhood' => 'Villa Morra',
            'status' => 'pending',
        ];
    }
}
