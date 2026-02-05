<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Facades\Http;
use Exception;

class BookService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('AUTHORS_SERVICE_URL', 'http://127.0.0.1:8000');
    }

    public function getAllBooks() 
    { 
        $books = Book::all();
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/authors");
            if ($response->successful()) {
                $authors = collect($response->json());
                $books->transform(function ($book) use ($authors) {
                    $author = $authors->firstWhere('id', $book->author_id);
                    $book->author_name = $author ? $author['full_name'] : 'Autor Desconocido';
                    return $book;
                });
            }
        } catch (Exception $e) {
            logger("Error al conectar con Authors Service: " . $e->getMessage());
        }
        return $books; 
    }

    public function getBookById($id) 
    { 
        $book = Book::find($id);
        if ($book) {
            // Buscamos el nombre del autor en Python para enriquecer el DTO
            $book->author_name = $this->getAuthorNameFromService($book->author_id);
        }
        return $book; 
    }

    public function createBookWithAuthorValidation(array $data)
    {
        $this->validateAuthor($data['author_id']);
        return Book::create($data);
    }

    /**
     * Soporta tanto PUT como PATCH
     */
    public function updateBookWithValidation($id, array $data)
    {
        $book = Book::find($id);
        if (!$book) return null;

        // Si el PATCH/PUT incluye autor, lo validamos externamente
        if (isset($data['author_id']) && $data['author_id'] != $book->author_id) {
            $this->validateAuthor($data['author_id']);
        }

        // fill() rellena solo los atributos presentes en el array $data
        $book->fill($data);
        $book->save();

        // Enriquecemos el nombre del autor antes de devolverlo
        $book->author_name = $this->getAuthorNameFromService($book->author_id);
        
        return $book;
    }

    public function deleteBook($id)
    {
        $book = Book::find($id);
        return $book ? $book->delete() : false;
    }

    private function getAuthorNameFromService($authorId)
    {
        try {
            $response = Http::timeout(3)->get("{$this->baseUrl}/authors/{$authorId}");
            return $response->successful() ? $response->json()['full_name'] : 'Autor no encontrado';
        } catch (Exception $e) {
            return 'Servicio de Autores Offline';
        }
    }

    private function validateAuthor($authorId)
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/authors/{$authorId}");
            if ($response->failed()) {
                throw new Exception("El autor {$authorId} no existe en el servicio de Python.");
            }
        } catch (Exception $e) {
            throw new Exception("Error de comunicación o validación con servicio de autores.");
        }
    }
}