<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Clase derivada Book que hereda de la abstracción Publication
 */
class Book extends Publication
{
    use HasFactory;

    // Se define la tabla asociada en PostgreSQL
    protected $table = 'books';

    // Atributos que se pueden asignar masivamente 
    protected $fillable = [
        'title',
        'content',
        'isbn',
        'author_id',
        'status'
    ];

    /**
     * Implementación del método abstracto de Publication
     */
    public function getFormattedTitle(): string
    {
        return "LIBRO: " . strtoupper($this->title) . " [ISBN: {$this->isbn}]";
    }

    /**
     * Casts para manejar tipos de datos específicos
     */
    protected $casts = [
        'created_at' => 'datetime:d/m/Y',
    ];
}