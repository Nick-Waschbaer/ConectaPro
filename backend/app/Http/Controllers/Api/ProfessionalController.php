<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    /** GET /api/professionals?service=Electricidad&neighborhood=Recoleta */
    public function index(Request $request): JsonResponse
    {
        $profesionales = Professional::query()
            ->when($request->query('service'), fn ($q, $v) => $q->where('service', $v))
            ->when($request->query('neighborhood'), fn ($q, $v) => $q->where('neighborhood', $v))
            ->orderBy('id')
            ->get(['id', 'name', 'service', 'description', 'neighborhood', 'rating']);

        // Lista vacía => 200 con [] (lo pide el contrato)
        return response()->json($profesionales);
    }
}
