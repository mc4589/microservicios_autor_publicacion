<?php

namespace App\Repositories;

use App\Models\Book;

class BookRepository
{
    public function getAll()
    {
        return Book::all();
    }

    public function findById($id)
    {
        return Book::find($id);
    }

    public function create(array $data)
    {
        // El estado por defecto será 'DRAFT' para la migración
        return Book::create($data);
    }
}