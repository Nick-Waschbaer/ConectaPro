<?php

namespace Tests\Feature;

use Tests\TestCase;

class CorsTest extends TestCase
{
    private function preflight(string $origin)
    {
        return $this->call('OPTIONS', '/api/service-requests', [], [], [], [
            'HTTP_ORIGIN' => $origin,
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'content-type',
        ]);
    }

    public function test_permite_el_origen_local_de_vite(): void
    {
        $this->preflight('http://localhost:5173')
            ->assertSuccessful()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }

    public function test_permite_el_dominio_de_vercel_configurado(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:5173', 'https://demo.vercel.app']]);

        $this->preflight('https://demo.vercel.app')
            ->assertHeader('Access-Control-Allow-Origin', 'https://demo.vercel.app');
    }

    public function test_no_permite_un_origen_desconocido(): void
    {
        $this->preflight('https://sitio-malicioso.example')
            ->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_las_respuestas_get_llevan_cabecera_cors_para_origen_permitido(): void
    {
        $this->getJson('/api/health', ['Origin' => 'http://localhost:5173'])
            ->assertOk()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
}
