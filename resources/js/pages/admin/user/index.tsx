import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    photo: string | null;
    photo_url: string | null;
    program_studi_id: number | null;
    program_studi?: ProgramStudi;
};

type PaginatedData = {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    users: PaginatedData;
    programStudis: ProgramStudi[];
    filters: {
        search?: string;
        role?: string;
    };
};

const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    admin_prodi: 'Admin Program Studi',
    dosen: 'Dosen',
    mahasiswa: 'Mahasiswa',
    pimpinan: 'Pimpinan',
};

const ROLE_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    admin: 'default',
    admin_prodi: 'secondary',
    dosen: 'outline',
    mahasiswa: 'outline',
    pimpinan: 'destructive',
};

export default function UserIndex({ users, programStudis, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const handleSearch = () => {
        router.get(
            '/admin/user',
            {
                search,
                role: roleFilter === 'all' ? '' : roleFilter,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleRoleChange = (value: string) => {
        setRoleFilter(value);
        router.get(
            '/admin/user',
            {
                search,
                role: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/user/${id}`);
    };

    return (
        <>
            <Head title="Manajemen User" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Manajemen User
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola semua akun pengguna sistem
                        </p>
                    </div>
                    <Link href="/admin/user/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah User
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="admin_prodi">
                                Admin Program Studi
                            </SelectItem>
                            <SelectItem value="dosen">Dosen</SelectItem>
                            <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                            <SelectItem value="pimpinan">Pimpinan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead> Foto</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data user
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                {user.photo_url ? (
                                                    <img
                                                        src={user.photo_url}
                                                        alt={user.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                        <span className="text-sm font-medium text-green-700">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        ROLE_VARIANTS[
                                                            user.role
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {ROLE_LABELS[user.role] ||
                                                        user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.program_studi
                                                    ?.nama_prodi || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/user/${user.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Hapus User
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    user{' '}
                                                                    {user.name}?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {users.data.length} dari {users.total}{' '}
                            data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: users.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === users.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/user', {
                                            ...filters,
                                            page,
                                        })
                                    }
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

UserIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'User', href: '/admin/user' },
        ]}
    >
        {page}
    </AppLayout>
);
