<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'content'     => $this->content,
            'isbn'        => $this->isbn,
            'author_id'   => $this->author_id,
            //'author_name' se carga en el Service o Model
            'author_name' => $this->author_name ?? 'Autor no verificado', 
            'status'      => $this->status,
            'created_at'  => $this->created_at->format('Y-m-d H:i'),
        ];
    }
}