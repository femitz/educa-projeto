<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Categoria extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nome',
    ];

    public function cursos(): BelongsToMany
    {
        return $this->belongsToMany(Curso::class, 'categoria_curso');
    }

    public static function populares($limit = 5)
    {
        $categoriasComAcesso = static::select('categorias.*')
            ->selectRaw('COUNT(DISTINCT curso_usuario.user_id) as total_acessos')
            ->join('categoria_curso', 'categorias.id', '=', 'categoria_curso.categoria_id')
            ->leftJoin('curso_usuario', 'categoria_curso.curso_id', '=', 'curso_usuario.curso_id')
            ->groupBy('categorias.id', 'categorias.nome', 'categorias.created_at', 'categorias.updated_at')
            ->havingRaw('COUNT(DISTINCT curso_usuario.user_id) > 0')
            ->orderByDesc('total_acessos')
            ->limit($limit)
            ->get();

        if ($categoriasComAcesso->isEmpty()) {
            return static::limit($limit)->get()->map(function ($categoria) {
                $categoria->total_acessos = 0;
                return $categoria;
            });
        }

        return $categoriasComAcesso;
    }
}

