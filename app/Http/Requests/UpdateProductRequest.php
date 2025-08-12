<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('products', 'name')->ignore($this->route('product')->id)],
            'description' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'price' => 'required|numeric|min:0.01',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'status' => 'required|in:available,out_of_stock,discontinued',
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
            'name.required' => 'Product name is required.',
            'name.unique' => 'A product with this name already exists.',
            'price.required' => 'Product price is required.',
            'price.min' => 'Product price must be at least $0.01.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category is invalid.',
        ];
    }
}