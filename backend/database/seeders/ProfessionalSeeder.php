<?php

namespace Database\Seeders;

use App\Models\Professional;
use Illuminate\Database\Seeder;

/** Profesionales FICTICIOS para la demo. No son personas reales ni están verificados. */
class ProfessionalSeeder extends Seeder
{
    public function run(): void
    {
        $profesionales = [
            ['Juan Pérez (demo)', 'Electricidad', 'Instalaciones y reparaciones eléctricas del hogar', 'Villa Morra', 4.8],
            ['Marta Gómez (demo)', 'Electricidad', 'Cambio de tomacorrientes, luces y tableros', 'Recoleta', 4.5],
            ['Carlos Benítez (demo)', 'Plomería', 'Pérdidas, cañerías y destapes', 'Sajonia', 4.6],
            ['Ana Duarte (demo)', 'Plomería', 'Instalación de grifería y sanitarios', 'Villa Morra', 4.2],
            ['Luis Ortiz (demo)', 'Pintura', 'Pintura de interiores y exteriores', 'Recoleta', 4.7],
            ['Rosa Acosta (demo)', 'Aire acondicionado', 'Instalación y mantenimiento de equipos split', 'Sajonia', 4.4],
        ];

        foreach ($profesionales as [$name, $service, $description, $neighborhood, $rating]) {
            Professional::updateOrCreate(
                ['name' => $name],
                compact('service', 'description', 'neighborhood', 'rating'),
            );
        }
    }
}
