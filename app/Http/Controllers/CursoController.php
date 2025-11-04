<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CursoController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $categoriaId = $request->query('categoria_id');

        $query = Curso::with('categorias')->withCount('usuarios');

        if ($categoriaId) {
            $query->whereHas('categorias', function ($q) use ($categoriaId) {
                $q->where('categorias.id', $categoriaId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('descricao', 'like', "%{$search}%");
            });
        }

        $cursos = $query->get();

        $categoriasPopulares = Categoria::populares(5);

        $queryRecomendados = Curso::recomendados()->with('categorias');
        if ($categoriaId) {
            $queryRecomendados->whereHas('categorias', function ($q) use ($categoriaId) {
                $q->where('categorias.id', $categoriaId);
            });
        }
        $cursosRecomendados = $queryRecomendados->limit(6)->get();

        $categoriaSelecionada = $categoriaId ? Categoria::find($categoriaId) : null;

        $user = $request->user();
        $cursosIdsInscritos = $user ? $user->cursos()->pluck('cursos.id')->toArray() : [];

        return Inertia::render('cursos/index', [
            'cursos' => $cursos,
            'categoriasPopulares' => $categoriasPopulares,
            'cursosRecomendados' => $cursosRecomendados,
            'search' => $search,
            'categoriaId' => $categoriaId ? (int) $categoriaId : null,
            'categoriaSelecionada' => $categoriaSelecionada,
            'cursosIdsInscritos' => $cursosIdsInscritos,
        ]);
    }

    public function inscrever(Request $request, Curso $curso)
    {
        $user = $request->user();

        if (!$user->cursos()->where('curso_id', $curso->id)->exists()) {
            $user->cursos()->attach($curso->id);
        }

        return back();
    }

    public function cancelarInscricao(Request $request, Curso $curso)
    {
        $user = $request->user();

        $user->cursos()->detach($curso->id);

        return back();
    }
}

