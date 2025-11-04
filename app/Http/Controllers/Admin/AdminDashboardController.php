<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalCursos = Curso::count();
        $totalCategorias = Categoria::count();
        $totalUsuarios = User::count();
        $totalInscricoes = \DB::table('curso_usuario')->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalCursos' => $totalCursos,
                'totalCategorias' => $totalCategorias,
                'totalUsuarios' => $totalUsuarios,
                'totalInscricoes' => $totalInscricoes,
            ],
        ]);
    }
}
