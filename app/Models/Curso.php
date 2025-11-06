<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Curso extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nome',
        'descricao',
        'tempo_horas',
        'empresa',
        'link',
    ];

    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'categoria_curso');
    }

    public function usuarios(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'curso_usuario')
            ->withTimestamps();
    }

    public function scopeRecomendados($query)
    {
        return $query->withCount('usuarios')
            ->orderBy('usuarios_count', 'desc');
    }
}

