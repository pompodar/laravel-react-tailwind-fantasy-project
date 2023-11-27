<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArticleController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::delete('/users/{userId}', [UserController::class, 'deleteUser']);

Route::get('/users/', [UserController::class, 'getUsers']);

Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);

Route::get('/get-messages/', [\App\Http\Controllers\ChatController::class, 'index']);

Route::post('/articles/create', [ArticleController::class, 'store']);