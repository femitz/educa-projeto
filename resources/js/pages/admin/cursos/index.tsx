import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Curso } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Clock, Building2, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { maxString } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Cursos',
        href: '/admin/cursos',
    },
];

interface AdminCursosIndexProps {
    cursos: Curso[];
}

export default function AdminCursosIndex({ cursos }: AdminCursosIndexProps) {
    const handleDelete = (cursoId: number, cursoNome: string) => {
        if (confirm(`Tem certeza que deseja excluir o curso "${cursoNome}"?`)) {
            router.delete(`/admin/cursos/${cursoId}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Cursos" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Cursos</h1>
                        <p className="text-muted-foreground">Crie, edite e exclua cursos</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/cursos/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Curso
                        </Link>
                    </Button>
                </div>

                {cursos.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cursos.map((curso) => (
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
                                                    <Badge
                                                        key={categoria.id}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {categoria.nome}
                                                    </Badge>
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
                                <CardContent className="flex gap-2 pt-0">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Link href={`/admin/cursos/${curso.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleDelete(curso.id, curso.nome)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Nenhum curso cadastrado</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comece criando seu primeiro curso
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/cursos/create">Criar Curso</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

