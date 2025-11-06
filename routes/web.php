<?php

use App\Http\Controllers\CursoController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('cursos', [CursoController::class, 'index'])->name('cursos.index');
    Route::post('cursos/{curso}/inscrever', [CursoController::class, 'inscrever'])->name('cursos.inscrever');
    Route::delete('cursos/{curso}/cancelar', [CursoController::class, 'cancelarInscricao'])->name('cursos.cancelar');
});

require __DIR__.'/settings.php';
