import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Curso } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { BookOpen, Clock, Building2, Users, ExternalLink, UserMinus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { maxString } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    cursosEmAndamento: Curso[];
}

export default function Dashboard({ cursosEmAndamento }: DashboardProps) {
    const handleCancelarInscricao = (cursoId: number) => {
        router.delete(`/cursos/${cursoId}/cancelar`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cursosEmAndamento'] });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Acompanhe seus cursos em andamento</p>
                </div>

                {cursosEmAndamento.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">Meus Cursos em Andamento</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cursosEmAndamento.map((curso) => (
                                <Card key={curso.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg line-clamp-2">{curso.nome}</CardTitle>
                                        <CardDescription className="line-clamp-3">
                                            {maxString(curso.descricao)}
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
                                                            data={{ categoria_id: categoria.id }}
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
                                                className="w-full cursor-pointer"
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
                                        <Button
                                            onClick={() => handleCancelarInscricao(curso.id)}
                                            variant="destructive"
                                            className="w-full cursor-pointer"
                                        >
                                            <UserMinus className="h-4 w-4 mr-2" />
                                            Cancelar Inscrição
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Nenhum curso em andamento</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Explore nossos cursos e comece a aprender hoje!
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/cursos">Ver Cursos</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
