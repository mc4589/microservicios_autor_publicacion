<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Clase Abstracta (Domain Model)
 */
abstract class Publication extends Model
{
    /**
     * Método abstracto que obliga a las clases hijas (como Book) 
     * a definir cómo quieren mostrar su título formateado.
     */
    abstract public function getFormattedTitle(): string;

    // Lógica compartida: Solo se pueden mostrar las publicaciones aprobadas
    public function isAvailable(): bool
    {
        return $this->status === 'PUBLISHED';
    }
}