import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Categoria } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Categorias',
        href: '/admin/categorias',
    },
    {
        title: 'Editar',
        href: '#',
    },
];

interface AdminCategoriasEditProps {
    categoria: Categoria;
}

export default function AdminCategoriasEdit({ categoria }: AdminCategoriasEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Categoria - ${categoria.nome}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/categorias">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Editar Categoria</h1>
                        <p className="text-muted-foreground">Atualize o nome da categoria</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Categoria</CardTitle>
                        <CardDescription>
                            Preencha o campo obrigatório
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={`/admin/categorias/${categoria.id}`}
                            method="patch"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nome">Nome da Categoria *</Label>
                                        <Input
                                            id="nome"
                                            name="nome"
                                            defaultValue={categoria.nome}
                                            required
                                            placeholder="Ex: Tecnologia"
                                        />
                                        <InputError message={errors.nome} />
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/admin/categorias">Cancelar</Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

