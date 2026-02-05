<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Agregamos PATCH manualmente ya que apiResource no lo mapea automáticamente a un método específico
Route::patch('books/{id}', [BookController::class, 'updatePartial']);

// Mantiene las rutas estándar: index, store, show, update (PUT), destroy
Route::apiResource('books', BookController::class);