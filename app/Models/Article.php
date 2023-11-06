<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Searchable;

class Article extends Model
{
    use HasFactory;
    use Searchable;

    protected $casts = [
        'tags' => 'json',
    ];

     public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
