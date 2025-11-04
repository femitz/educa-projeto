import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Categoria } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Categorias',
        href: '/admin/categorias',
    },
];

interface AdminCategoriasIndexProps {
    categorias: (Categoria & { cursos_count?: number })[];
}

export default function AdminCategoriasIndex({ categorias }: AdminCategoriasIndexProps) {
    const handleDelete = (categoriaId: number, categoriaNome: string) => {
        if (confirm(`Tem certeza que deseja excluir a categoria "${categoriaNome}"?`)) {
            router.delete(`/admin/categorias/${categoriaId}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Categorias" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h1>
                        <p className="text-muted-foreground">Crie, edite e exclua categorias</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/categorias/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Categoria
                        </Link>
                    </Button>
                </div>

                {categorias.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categorias.map((categoria) => (
                            <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            {categoria.nome}
                                        </CardTitle>
                                        {categoria.cursos_count !== undefined && (
                                            <Badge variant="secondary">
                                                {categoria.cursos_count} {categoria.cursos_count === 1 ? 'curso' : 'cursos'}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Categoria criada em {new Date(categoria.created_at).toLocaleDateString('pt-BR')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Link href={`/admin/categorias/${categoria.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleDelete(categoria.id, categoria.nome)}
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
                        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Nenhuma categoria cadastrada</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comece criando sua primeira categoria
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/categorias/create">Criar Categoria</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

