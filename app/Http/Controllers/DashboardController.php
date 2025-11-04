<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $cursosEmAndamento = $user ? $user->cursos()
            ->with('categorias')
            ->withCount('usuarios')
            ->get() : collect();

        return Inertia::render('dashboard', [
            'cursosEmAndamento' => $cursosEmAndamento,
        ]);
    }
}

