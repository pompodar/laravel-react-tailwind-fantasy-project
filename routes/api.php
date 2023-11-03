<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::delete('/users/{userId}', [UserController::class, 'deleteUser']);

Route::get('/users/', [UserController::class, 'getUsers']);

Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);

Route::get('/get-messages/', [\App\Http\Controllers\ChatController::class, 'index']);
