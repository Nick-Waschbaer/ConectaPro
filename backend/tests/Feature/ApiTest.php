<?php

namespace Tests\Feature;

use App\Models\Professional;
use App\Models\ServiceRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $override = []): array
    {
        return array_merge([
            'professional_id' => Professional::factory()->create()->id,
            'customer_name' => 'Cliente de prueba',
            'contact_phone' => '0981000000',
            'description' => 'Revisar un enchufe que no funciona',
            'neighborhood' => 'Villa Morra',
        ], $override);
    }

    public function test_health_responde_ok(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertExactJson(['status' => 'ok', 'application' => 'ConectaPro API']);
    }

    public function test_lista_profesionales_y_filtra_por_oficio(): void
    {
        Professional::factory()->create(['service' => 'Electricidad']);
        Professional::factory()->create(['service' => 'Plomería']);

        $this->getJson('/api/professionals')->assertOk()->assertJsonCount(2);

        $this->getJson('/api/professionals?service=Electricidad')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.service', 'Electricidad')
            ->assertJsonStructure([['id', 'name', 'service', 'description', 'neighborhood', 'rating']]);
    }

    public function test_filtro_sin_coincidencias_devuelve_lista_vacia(): void
    {
        Professional::factory()->create(['service' => 'Electricidad']);

        $this->getJson('/api/professionals?service=Jardinería')->assertOk()->assertExactJson([]);
    }

    public function test_crea_solicitud_valida_y_la_guarda(): void
    {
        $data = $this->payload();

        $this->postJson('/api/service-requests', $data)
            ->assertCreated()
            ->assertJsonPath('message', 'Solicitud creada correctamente')
            ->assertJsonPath('data.professional_id', $data['professional_id'])
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('service_requests', $data + ['status' => 'pending']);
    }

    public function test_solicitud_sin_campos_devuelve_422_con_errores_por_campo(): void
    {
        $this->postJson('/api/service-requests', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'professional_id', 'customer_name', 'contact_phone', 'description', 'neighborhood',
            ])
            ->assertJsonStructure(['message', 'errors']);

        $this->assertDatabaseCount('service_requests', 0);
    }

    public function test_solicitud_con_profesional_inexistente_devuelve_422(): void
    {
        $this->postJson('/api/service-requests', $this->payload(['professional_id' => 9999]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['professional_id']);
    }

    public function test_telefono_invalido_devuelve_422(): void
    {
        $this->postJson('/api/service-requests', $this->payload(['contact_phone' => 'abc']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['contact_phone']);
    }

    public function test_el_cliente_no_puede_forzar_el_estado(): void
    {
        $this->postJson('/api/service-requests', $this->payload(['status' => 'completed']))
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending');

        $this->assertSame('pending', ServiceRequest::first()->status);
    }
}
