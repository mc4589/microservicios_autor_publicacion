<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreBookRequest;
use App\Http\Resources\BookResource;
use App\Services\BookService;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Exception;

class BookController extends Controller
{
    protected $service;

    public function __construct(BookService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return BookResource::collection($this->service->getAllBooks());
    }

    public function store(StoreBookRequest $request)
    {
        try {
            $book = $this->service->createBookWithAuthorValidation($request->validated());
            return new BookResource($book);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function show($id)
    {
        try {
            $book = $this->service->getBookById($id);
            if (!$book) {
                return response()->json(['message' => 'Libro no encontrado'], 404);
            }
            return new BookResource($book);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error al recuperar el libro'], 500);
        }
    }

    // Método PUT (Reemplazo total)
    public function update(Request $request, $id) 
    {
        try {
            $book = $this->service->updateBookWithValidation($id, $request->all());
            if (!$book) return response()->json(['message' => 'Libro no encontrado'], 404);
            return new BookResource($book);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * MÉTODO PATCH (Actualización parcial)
    */
    public function updatePartial(Request $request, $id)
    {
        try {
            // El servicio maneja la actualización solo de los campos presentes
            $book = $this->service->updateBookWithValidation($id, $request->all());
            
            if (!$book) return response()->json(['message' => 'Libro no encontrado'], 404);

            return new BookResource($book);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->service->deleteBook($id);
        return $deleted 
            ? response()->json(['message' => 'Libro eliminado exitosamente']) 
            : response()->json(['message' => 'Libro no encontrado'], 404);
    }
}