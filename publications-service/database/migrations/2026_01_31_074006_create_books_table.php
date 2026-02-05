<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutamos la migración para crear la tabla 'books' en PostgreSQL.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id(); // Identificador único (Big Incremental)
            $table->string('title'); // Título del libro
            $table->text('content'); // Contenido o sinopsis
            $table->string('isbn')->unique(); // Código único del libro
            
            /**
             * NOTA: author_id es una clave foránea LÓGICA.
             * No se usa $table->foreign() porque el autor reside en una base de datos MySQL 
             * diferente. La integridad se valida vía HTTP en la capa de Servicio.
             */
            $table->unsignedBigInteger('author_id');

            /**
             * Definición de estados para el flujo editorial (BPMN)
             */
            $table->enum('status', ['DRAFT', 'INREVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED'])
                  ->default('DRAFT');

            $table->timestamps(); // Crea 'created_at' y 'updated_at'
        });
    }

    /**
     * Revierte la migración (borra la tabla).
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
