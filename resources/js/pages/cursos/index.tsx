import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Curso, type Categoria } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { Search, Clock, Building2, BookOpen, X, UserPlus, ExternalLink, Users, UserMinus } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { debounce, cn } from '@/lib/utils';

interface CursosPageProps {
    cursos: Curso[];
    categoriasPopulares: Categoria[];
    cursosRecomendados: Curso[];
    search: string;
    categoriaId?: number | null;
    categoriaSelecionada?: Categoria | null;
    cursosIdsInscritos?: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cursos',
        href: '/cursos',
    },
];

export default function CursosIndex({ 
    cursos, 
    categoriasPopulares, 
    cursosRecomendados, 
    search: initialSearch,
    categoriaId,
    categoriaSelecionada,
    cursosIdsInscritos = []
}: CursosPageProps) {
    const [search, setSearch] = useState(initialSearch || '');

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            const params: { search?: string; categoria_id?: number } = {};
            if (value) params.search = value;
            if (categoriaId) params.categoria_id = categoriaId;
            
            router.get('/cursos', params, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300),
        [router, categoriaId]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handleRemoverFiltro = () => {
        const params: { search?: string } = {};
        if (search) params.search = search;
        
        router.get('/cursos', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const truncateDescription = (text: string, maxLength: number = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleInscrever = (cursoId: number) => {
        router.post(`/cursos/${cursoId}/inscrever`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cursosIdsInscritos'] });
            }
        });
    };

    const handleCancelarInscricao = (cursoId: number) => {
        router.delete(`/cursos/${cursoId}/cancelar`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cursosIdsInscritos'] });
            }
        });
    };

    const isInscrito = (cursoId: number) => {
        return cursosIdsInscritos.includes(cursoId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cursos" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
                            <p className="text-muted-foreground mt-1">Explore nossa biblioteca de cursos</p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Pesquisar cursos..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                </div>

                {categoriasPopulares.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Categorias Populares</h2>
                            {categoriaSelecionada && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoverFiltro}
                                    className="text-xs"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Remover filtro
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categoriasPopulares.map((categoria) => {
                                const isSelected = categoriaId === categoria.id;
                                return (
                                    <Link
                                        key={categoria.id}
                                        href="/cursos"
                                        data={{ categoria_id: categoria.id, search }}
                                        preserveState
                                        preserveScroll
                                        className={cn(
                                            "px-3 py-1.5 text-sm rounded-md border transition-colors inline-flex items-center",
                                            isSelected
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-transparent border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                        )}
                                    >
                                        {categoria.nome}
                                    </Link>
                                );
                            })}
                        </div>
                        {categoriaSelecionada && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Filtrado por:</span>
                                <Badge variant="secondary">{categoriaSelecionada.nome}</Badge>
                            </div>
                        )}
                    </div>
                )}

                {cursosRecomendados.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Cursos Recomendados</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cursosRecomendados.map((curso) => (
                                <Card key={curso.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-lg line-clamp-2">{curso.nome}</CardTitle>
                                            <Badge variant="secondary" className="shrink-0">
                                                Recomendado
                                            </Badge>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {truncateDescription(curso.descricao)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-3">
                                            {curso.categorias && curso.categorias.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {curso.categorias.map((categoria) => (
                                                        <Link
                                                            key={categoria.id}
                                                            href="/cursos"
                                                            data={{ categoria_id: categoria.id, search }}
                                                            preserveState
                                                            preserveScroll
                                                            className="inline-flex"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs cursor-pointer hover:bg-accent transition-colors"
                                                            >
                                                                {categoria.nome}
                                                            </Badge>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{curso.tempo_horas}h</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{curso.empresa}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{curso.usuarios_count || 0} {curso.usuarios_count === 1 ? 'inscrito' : 'inscritos'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        {curso.link && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <a
                                                    href={curso.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Acessar Curso
                                                </a>
                                            </Button>
                                        )}
                                        {isInscrito(curso.id) ? (
                                            <Button
                                                onClick={() => handleCancelarInscricao(curso.id)}
                                                variant="destructive"
                                                className="w-full cursor-pointer"
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Cancelar Inscrição
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleInscrever(curso.id)}
                                                variant="default"
                                                className="w-full cursor-pointer"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Inscrever-se
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">
                        {categoriaSelecionada 
                            ? `Cursos de ${categoriaSelecionada.nome} (${cursos.length})`
                            : search 
                                ? `Resultados da pesquisa (${cursos.length})` 
                                : `Todos os Cursos (${cursos.length})`
                        }
                    </h2>
                    {cursos.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cursos.map((curso) => (
                                <Card key={curso.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg line-clamp-2">{curso.nome}</CardTitle>
                                        <CardDescription className="line-clamp-3">
                                            {truncateDescription(curso.descricao)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-3">
                                            {curso.categorias && curso.categorias.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {curso.categorias.map((categoria) => (
                                                        <Link
                                                            key={categoria.id}
                                                            href="/cursos"
                                                            data={{ categoria_id: categoria.id, search }}
                                                            preserveState
                                                            preserveScroll
                                                            className="inline-flex"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs cursor-pointer hover:bg-accent transition-colors"
                                                            >
                                                                {categoria.nome}
                                                            </Badge>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{curso.tempo_horas}h</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{curso.empresa}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{curso.usuarios_count || 0} {curso.usuarios_count === 1 ? 'inscrito' : 'inscritos'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        {curso.link && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <a
                                                    href={curso.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Acessar Curso
                                                </a>
                                            </Button>
                                        )}
                                        {isInscrito(curso.id) ? (
                                            <Button
                                                onClick={() => handleCancelarInscricao(curso.id)}
                                                variant="destructive"
                                                className="w-full cursor-pointer"
                                            >
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Cancelar Inscrição
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleInscrever(curso.id)}
                                                variant="default"
                                                className="w-full cursor-pointer"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Inscrever-se
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">Nenhum curso encontrado</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {search ? 'Tente pesquisar com outros termos' : 'Não há cursos disponíveis no momento'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

