<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // MVP sin autenticación
    }

    public function rules(): array
    {
        return [
            'professional_id' => ['required', 'integer', 'exists:professionals,id'],
            'customer_name' => ['required', 'string', 'max:100'],
            'contact_phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\s()-]{6,30}$/'],
            'description' => ['required', 'string', 'max:1000'],
            'neighborhood' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'professional_id.required' => 'El profesional es obligatorio.',
            'professional_id.exists' => 'El profesional seleccionado no existe.',
            'customer_name.required' => 'El nombre es obligatorio.',
            'contact_phone.required' => 'El teléfono de contacto es obligatorio.',
            'contact_phone.regex' => 'El teléfono no tiene un formato válido.',
            'description.required' => 'La descripción es obligatoria.',
            'neighborhood.required' => 'El barrio es obligatorio.',
        ];
    }
}
