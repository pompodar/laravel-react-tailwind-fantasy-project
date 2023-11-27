<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();

        return response()->json(['articles' => $articles]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'array'
        ]);

        $user = Auth::user();

        $article = Article::create([
            'user_id' => 1,
            'title' => $request->input('title'),
            'body' => $request->input('content'),
            'tags' => $request->input('tags'),
        ]);

        return response()->json(['article' => $article], 201);
    }
}
