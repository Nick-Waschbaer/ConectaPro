<?php

namespace Database\Seeders;

use App\Models\Professional;
use Illuminate\Database\Seeder;

/**
 * Profesionales FICTICIOS de ejemplo (100 en total). Los nombres son inventados y pueden coincidir
 * por casualidad con personas reales. No son personas reales ni están verificados.
 *
 * - Es seguro ejecutarlo varias veces: no duplica (usa updateOrCreate por nombre).
 * - Los 6 primeros conservan su ID original: las solicitudes guardadas apuntan a ellos.
 * - Cubre las 7 × 10 combinaciones de oficio y barrio al menos una vez, así ningún filtro queda vacío.
 */
class ProfessionalSeeder extends Seeder
{
    /** Oficio => descripciones posibles. */
    private const OFICIOS = [
        'Electricidad' => [
            'Instalaciones y reparaciones eléctricas del hogar',
            'Cambio de tomacorrientes, luces y tableros',
            'Revisión de cortocircuitos y cableado',
        ],
        'Plomería' => [
            'Pérdidas, cañerías y destapes',
            'Instalación de grifería y sanitarios',
            'Reparación de tanques y desagües',
        ],
        'Pintura' => [
            'Pintura de interiores y exteriores',
            'Pintura de paredes, techos y portones',
            'Preparación de superficies y pintura decorativa',
        ],
        'Aire acondicionado' => [
            'Instalación y mantenimiento de equipos split',
            'Limpieza y carga de gas de aires acondicionados',
            'Diagnóstico y reparación de equipos',
        ],
        'Carpintería' => [
            'Muebles a medida, placares y estantes',
            'Reparación de puertas y aberturas de madera',
            'Armado e instalación de muebles y cocinas',
        ],
        'Cerrajería' => [
            'Apertura de puertas y cambio de cerraduras',
            'Copias de llaves y cerraduras de seguridad',
            'Reparación de portones y rejas',
        ],
        'Jardinería' => [
            'Corte de césped y poda de plantas',
            'Diseño y mantenimiento de jardines',
            'Limpieza de terrenos y control de malezas',
        ],
    ];

    private const BARRIOS = [
        'Villa Morra', 'Recoleta', 'Sajonia', 'Las Mercedes', 'Mburucuyá',
        'Carmelitas', 'Manorá', 'Villa Aurelia', 'Trinidad', 'Obrero',
    ];

    private const NOMBRES = [
        'Diego', 'Lucía', 'Marcelo', 'Sofía', 'Gustavo', 'Verónica', 'Rubén', 'Natalia', 'Fabián', 'Carolina',
        'Héctor', 'Andrea', 'Óscar', 'Patricia', 'Ramón', 'Liliana', 'Sergio', 'Mónica', 'Víctor', 'Gabriela',
        'Alberto', 'Silvia', 'Nelson', 'Claudia', 'Édgar', 'Teresa', 'Julio', 'Mirtha', 'Cristian', 'Fátima',
    ];

    private const APELLIDOS = [
        'González', 'Villalba', 'Ayala', 'Giménez', 'Martínez', 'Báez', 'Romero', 'Cabrera', 'Fernández', 'López',
        'Rojas', 'Vera', 'Aquino', 'Insfrán', 'Cáceres', 'Ramírez', 'Franco', 'Britez', 'Samudio', 'Servín',
        'Escobar', 'Amarilla', 'Lezcano', 'Peralta', 'Samaniego', 'Alderete', 'Bogado', 'Molinas', 'Riveros', 'Colmán',
    ];

    /** Los 6 profesionales originales, ahora sin el sufijo "(demo)". */
    private const ORIGINALES = [
        ['Juan Pérez', 'Electricidad', 'Instalaciones y reparaciones eléctricas del hogar', 'Villa Morra', 4.8],
        ['Marta Gómez', 'Electricidad', 'Cambio de tomacorrientes, luces y tableros', 'Recoleta', 4.5],
        ['Carlos Benítez', 'Plomería', 'Pérdidas, cañerías y destapes', 'Sajonia', 4.6],
        ['Ana Duarte', 'Plomería', 'Instalación de grifería y sanitarios', 'Villa Morra', 4.2],
        ['Luis Ortiz', 'Pintura', 'Pintura de interiores y exteriores', 'Recoleta', 4.7],
        ['Rosa Acosta', 'Aire acondicionado', 'Instalación y mantenimiento de equipos split', 'Sajonia', 4.4],
    ];

    public function run(): void
    {
        // 1) Quita el " (demo)" de los 6 existentes SIN cambiar su ID (así las solicitudes siguen vinculadas).
        foreach (self::ORIGINALES as [$name]) {
            Professional::where('name', $name.' (demo)')->update(['name' => $name]);
        }

        // 2) Crea o actualiza los 100 (por nombre: repetir el seeder no duplica).
        foreach ($this->profesionales() as [$name, $service, $description, $neighborhood, $rating]) {
            Professional::updateOrCreate(
                ['name' => $name],
                compact('service', 'description', 'neighborhood', 'rating'),
            );
        }
    }

    /** @return array<int, array{0:string,1:string,2:string,3:string,4:float}> */
    private function profesionales(): array
    {
        $lista = self::ORIGINALES;
        $usados = array_column($lista, 0);
        $cubiertas = [];
        foreach ($lista as [, $oficio, , $barrio]) {
            $cubiertas[$oficio.'|'.$barrio] = true;
        }

        // Combinaciones de oficio y barrio que todavía no tienen a nadie (64).
        $pendientes = [];
        foreach (array_keys(self::OFICIOS) as $oficio) {
            foreach (self::BARRIOS as $barrio) {
                if (! isset($cubiertas[$oficio.'|'.$barrio])) {
                    $pendientes[] = [$oficio, $barrio];
                }
            }
        }

        // 30 más para dar variedad y llegar a 100 (determinista, sin azar).
        $oficios = array_keys(self::OFICIOS);
        for ($i = 0; $i < 30; $i++) {
            $pendientes[] = [$oficios[$i % count($oficios)], self::BARRIOS[($i * 3 + 1) % count(self::BARRIOS)]];
        }

        foreach ($pendientes as $k => [$oficio, $barrio]) {
            $lista[] = [
                $this->nombreUnico($k, $usados),
                $oficio,
                self::OFICIOS[$oficio][$k % 3],
                $barrio,
                round(3.8 + (($k * 7) % 13) / 10, 1), // entre 3.8 y 5.0, dato ficticio
            ];
        }

        return $lista;
    }

    /** Nombre y apellido ficticios, sin repetir ninguno ya usado. */
    private function nombreUnico(int $k, array &$usados): string
    {
        $n = count(self::NOMBRES);
        $a = count(self::APELLIDOS);
        $apellido = (($k % $n) * 11 + intdiv($k, $n) * 7) % $a;

        do {
            $name = self::NOMBRES[$k % $n].' '.self::APELLIDOS[$apellido];
            $apellido = ($apellido + 1) % $a;
        } while (in_array($name, $usados, true));

        $usados[] = $name;

        return $name;
    }
}
