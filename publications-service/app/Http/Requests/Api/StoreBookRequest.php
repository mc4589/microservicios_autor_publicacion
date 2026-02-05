<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'title'     => 'required|string|max:255',
            'content'   => 'required|string',
            'author_id' => 'required|integer',
            'isbn'      => 'required|string|unique:books,isbn',
            'status'    => 'required|string', 
        ];
    }

    public function messages(): array
    {
        return [
            'isbn.unique' => 'El código ISBN ya existe en la base de datos.',
            'status.required' => 'Debe seleccionar un estado para la publicación.',
        ];
    }
}