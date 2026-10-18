<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProfessionalController;
use App\Http\Controllers\Api\ServiceRequestController;
use Illuminate\Support\Facades\Route;

// Laravel añade automáticamente el prefijo /api a este archivo.
Route::get('/health', HealthController::class);
Route::get('/professionals', [ProfessionalController::class, 'index']);
Route::post('/service-requests', [ServiceRequestController::class, 'store']);
