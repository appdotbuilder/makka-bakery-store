<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_method' => 'required|in:pickup,delivery',
            'delivery_address' => 'required_if:delivery_method,delivery|nullable|string',
            'pickup_time' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_name.required' => 'Please provide your full name.',
            'customer_email.required' => 'Email address is required.',
            'customer_email.email' => 'Please provide a valid email address.',
            'customer_phone.required' => 'Phone number is required for order confirmation.',
            'delivery_method.required' => 'Please select pickup or delivery.',
            'delivery_address.required_if' => 'Delivery address is required for delivery orders.',
            'pickup_time.required' => 'Please select a pickup/delivery time.',
            'pickup_time.after' => 'Pickup/delivery time must be in the future.',
        ];
    }
}