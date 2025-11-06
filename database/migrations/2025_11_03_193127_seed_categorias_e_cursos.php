<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $categorias = [
            ['nome' => 'Programação', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Design', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Marketing', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Negócios', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Data Science', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'DevOps', 'created_at' => now(), 'updated_at' => now()],
        ];

        $categoriasIds = [];
        foreach ($categorias as $categoria) {
            $existing = DB::table('categorias')->where('nome', $categoria['nome'])->first();
            if (!$existing) {
                $id = DB::table('categorias')->insertGetId($categoria);
                $categoriasIds[$categoria['nome']] = $id;
            } else {
                $categoriasIds[$categoria['nome']] = $existing->id;
            }
        }

        $cursos = [
            [
                'nome' => 'Laravel Avançado',
                'descricao' => 'Aprenda técnicas avançadas de desenvolvimento com Laravel, incluindo testes, performance e arquitetura.',
                'tempo_horas' => 40,
                'empresa' => 'Tech Academy',
                'link' => 'https://example.com/cursos/laravel-avancado',
                'categorias' => ['Programação', 'DevOps'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'React do Zero ao Avançado',
                'descricao' => 'Domine React com hooks, context API, performance e padrões de projeto modernos.',
                'tempo_horas' => 60,
                'empresa' => 'Code School',
                'link' => 'https://example.com/cursos/react-avancado',
                'categorias' => ['Programação'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'UI/UX Design Avançado',
                'descricao' => 'Crie interfaces incríveis com foco em experiência do usuário e design thinking.',
                'tempo_horas' => 50,
                'empresa' => 'Design Pro',
                'link' => 'https://example.com/cursos/uiux-design',
                'categorias' => ['Design'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Marketing Digital Completo',
                'descricao' => 'Estratégias de marketing digital, SEO, redes sociais e publicidade online.',
                'tempo_horas' => 45,
                'empresa' => 'Marketing Hub',
                'link' => 'https://example.com/cursos/marketing-digital',
                'categorias' => ['Marketing', 'Negócios'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Gestão de Projetos Ágil',
                'descricao' => 'Metodologias ágeis, Scrum, Kanban e ferramentas de gestão de equipes.',
                'tempo_horas' => 30,
                'empresa' => 'Business Pro',
                'link' => 'https://example.com/cursos/gestao-projetos',
                'categorias' => ['Negócios'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Python para Data Science',
                'descricao' => 'Análise de dados com Python, pandas, numpy e visualização de dados.',
                'tempo_horas' => 55,
                'empresa' => 'Data Academy',
                'link' => 'https://example.com/cursos/python-data-science',
                'categorias' => ['Data Science', 'Programação'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'AWS Cloud Practitioner',
                'descricao' => 'Fundamentos de cloud computing com AWS, serviços principais e arquiteturas.',
                'tempo_horas' => 35,
                'empresa' => 'Cloud Tech',
                'link' => 'https://example.com/cursos/aws-cloud',
                'categorias' => ['DevOps'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Figma para Designers',
                'descricao' => 'Aprenda a criar protótipos e designs profissionais com Figma.',
                'tempo_horas' => 25,
                'empresa' => 'Design Pro',
                'link' => 'https://example.com/cursos/figma-designers',
                'categorias' => ['Design'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'E-commerce e Vendas Online',
                'descricao' => 'Como criar e gerir um e-commerce de sucesso, estratégias de venda e conversão.',
                'tempo_horas' => 40,
                'empresa' => 'Marketing Hub',
                'link' => 'https://example.com/cursos/ecommerce',
                'categorias' => ['Marketing', 'Negócios'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'TypeScript para Desenvolvedores',
                'descricao' => 'Programação orientada a objetos, tipos avançados e patterns com TypeScript.',
                'tempo_horas' => 48,
                'empresa' => 'Code School',
                'link' => 'https://example.com/cursos/typescript',
                'categorias' => ['Programação'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($cursos as $cursoData) {
            $categoriasList = $cursoData['categorias'];
            unset($cursoData['categorias']);

            $existing = DB::table('cursos')->where('nome', $cursoData['nome'])->first();
            
            if (!$existing) {
                $cursoId = DB::table('cursos')->insertGetId($cursoData);

                foreach ($categoriasList as $categoriaNome) {
                    if (isset($categoriasIds[$categoriaNome])) {
                        $categoriaId = $categoriasIds[$categoriaNome];
                        $exists = DB::table('categoria_curso')
                            ->where('curso_id', $cursoId)
                            ->where('categoria_id', $categoriaId)
                            ->exists();

                        if (!$exists) {
                            DB::table('categoria_curso')->insert([
                                'categoria_id' => $categoriaId,
                                'curso_id' => $cursoId,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }

    public function down(): void
    {
        DB::table('categoria_curso')->truncate();
        DB::table('cursos')->truncate();
        DB::table('categorias')->truncate();
    }
};

