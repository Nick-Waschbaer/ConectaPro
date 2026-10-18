<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequestRequest;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;

class ServiceRequestController extends Controller
{
    /** POST /api/service-requests */
    public function store(StoreServiceRequestRequest $request): JsonResponse
    {
        // Solo llegan aquí datos ya validados. El estado inicial siempre es "pending".
        $solicitud = ServiceRequest::create($request->validated() + ['status' => 'pending']);

        return response()->json([
            'message' => 'Solicitud creada correctamente',
            'data' => [
                'id' => $solicitud->id,
                'professional_id' => $solicitud->professional_id,
                'status' => $solicitud->status,
            ],
        ], 201);
    }
}
