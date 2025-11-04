<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCursoRequest;
use App\Http\Requests\Admin\UpdateCursoRequest;
use App\Models\Categoria;
use App\Models\Curso;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminCursoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $cursos = Curso::with('categorias')
            ->withCount('usuarios')
            ->latest()
            ->get();

        return Inertia::render('admin/cursos/index', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categorias = Categoria::orderBy('nome')->get();

        return Inertia::render('admin/cursos/create', [
            'categorias' => $categorias,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCursoRequest $request): RedirectResponse
    {
        $curso = Curso::create($request->validated());

        if ($request->has('categorias') && is_array($request->categorias)) {
            $curso->categorias()->sync($request->categorias);
        }

        return redirect()->route('admin.cursos.index')
            ->with('success', 'Curso criado com sucesso!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Curso $curso): Response
    {
        $curso->load('categorias');
        $categorias = Categoria::orderBy('nome')->get();

        return Inertia::render('admin/cursos/edit', [
            'curso' => $curso,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCursoRequest $request, Curso $curso): RedirectResponse
    {
        $curso->update($request->validated());

        if ($request->has('categorias') && is_array($request->categorias)) {
            $curso->categorias()->sync($request->categorias);
        } else {
            $curso->categorias()->sync([]);
        }

        return redirect()->route('admin.cursos.index')
            ->with('success', 'Curso atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Curso $curso): RedirectResponse
    {
        $curso->delete();

        return redirect()->route('admin.cursos.index')
            ->with('success', 'Curso excluído com sucesso!');
    }
}
