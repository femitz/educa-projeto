import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Categoria } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Cursos',
        href: '/admin/cursos',
    },
    {
        title: 'Criar',
        href: '/admin/cursos/create',
    },
];

interface AdminCursosCreateProps {
    categorias: Categoria[];
}

export default function AdminCursosCreate({ categorias }: AdminCursosCreateProps) {
    const [selectedCategorias, setSelectedCategorias] = React.useState<number[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        nome: '',
        descricao: '',
        tempo_horas: '',
        empresa: '',
        link: '',
        categorias: [] as number[],
    });

    const handleCategoriaToggle = (categoriaId: number) => {
        const newCategorias = selectedCategorias.includes(categoriaId)
            ? selectedCategorias.filter((id) => id !== categoriaId)
            : [...selectedCategorias, categoriaId];
        setSelectedCategorias(newCategorias);
        setData('categorias', newCategorias);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cursos', {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/admin/cursos');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Curso" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/cursos">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Criar Curso</h1>
                        <p className="text-muted-foreground">Preencha os dados do novo curso</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Curso</CardTitle>
                        <CardDescription>
                            Preencha todos os campos obrigatórios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nome">Nome do Curso *</Label>
                                        <Input
                                            id="nome"
                                            name="nome"
                                            value={data.nome}
                                            onChange={(e) => setData('nome', e.target.value)}
                                            required
                                            placeholder="Ex: Desenvolvimento Web Completo"
                                        />
                                        <InputError message={errors.nome} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="descricao">Descrição *</Label>
                                        <textarea
                                            id="descricao"
                                            name="descricao"
                                            value={data.descricao}
                                            onChange={(e) => setData('descricao', e.target.value)}
                                            required
                                            rows={5}
                                            placeholder="Descreva o conteúdo do curso..."
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.descricao} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="tempo_horas">Tempo em Horas *</Label>
                                            <Input
                                                id="tempo_horas"
                                                name="tempo_horas"
                                                type="number"
                                                min="1"
                                                value={data.tempo_horas}
                                                onChange={(e) => setData('tempo_horas', e.target.value)}
                                                required
                                                placeholder="Ex: 40"
                                            />
                                            <InputError message={errors.tempo_horas} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="empresa">Empresa *</Label>
                                            <Input
                                                id="empresa"
                                                name="empresa"
                                                value={data.empresa}
                                                onChange={(e) => setData('empresa', e.target.value)}
                                                required
                                                placeholder="Ex: Microsoft"
                                            />
                                            <InputError message={errors.empresa} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="link">Link do Curso (opcional)</Label>
                                        <Input
                                            id="link"
                                            name="link"
                                            type="url"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                            placeholder="https://exemplo.com/curso"
                                        />
                                        <InputError message={errors.link} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Categorias</Label>
                                        <div className="grid grid-cols-2 gap-3 p-4 border rounded-md">
                                            {categorias.map((categoria) => (
                                                <div
                                                    key={categoria.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`categoria-${categoria.id}`}
                                                        checked={selectedCategorias.includes(categoria.id)}
                                                        onCheckedChange={() => handleCategoriaToggle(categoria.id)}
                                                    />
                                                    <Label
                                                        htmlFor={`categoria-${categoria.id}`}
                                                        className="font-normal cursor-pointer"
                                                    >
                                                        {categoria.nome}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.categorias} />
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/admin/cursos">Cancelar</Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Criar Curso
                                        </Button>
                                    </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

