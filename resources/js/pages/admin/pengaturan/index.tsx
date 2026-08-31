import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Settings,
    Save,
    Globe,
    Clock,
    Building,
} from 'lucide-react';

type Props = {
    settings: {
        app_name: string;
        app_url: string;
        app_locale: string;
        timezone: string;
    };
};

export default function PengaturanIndex({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        app_name: settings.app_name,
        app_url: settings.app_url,
        app_locale: settings.app_locale,
        timezone: settings.timezone,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/pengaturan');
    };

    const timezones = [
        'Asia/Jakarta',
        'Asia/Makassar',
        'Asia/Jayapura',
        'UTC',
    ];

    const locales = [
        { value: 'id', label: 'Bahasa Indonesia' },
        { value: 'en', label: 'English' },
    ];

    return (
        <>
            <Head title="Pengaturan Sistem" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">
                        Pengaturan Sistem
                    </h1>
                    <p className="text-gray-600">
                        Konfigurasi pengaturan aplikasi
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* General Settings */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900 flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-green-700" />
                                    Pengaturan Umum
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="app_name" className="text-gray-700">
                                        Nama Aplikasi
                                    </Label>
                                    <Input
                                        id="app_name"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    />
                                    {errors.app_name && (
                                        <p className="text-sm text-red-600">{errors.app_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="app_url" className="text-gray-700">
                                        URL Aplikasi
                                    </Label>
                                    <Input
                                        id="app_url"
                                        value={data.app_url}
                                        onChange={(e) => setData('app_url', e.target.value)}
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    />
                                    {errors.app_url && (
                                        <p className="text-sm text-red-600">{errors.app_url}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Locale Settings */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900 flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-green-700" />
                                    Pengaturan Lokal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="app_locale" className="text-gray-700">
                                        Bahasa
                                    </Label>
                                    <select
                                        id="app_locale"
                                        value={data.app_locale}
                                        onChange={(e) => setData('app_locale', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        {locales.map((locale) => (
                                            <option key={locale.value} value={locale.value}>
                                                {locale.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.app_locale && (
                                        <p className="text-sm text-red-600">{errors.app_locale}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone" className="text-gray-700">
                                        Zona Waktu
                                    </Label>
                                    <select
                                        id="timezone"
                                        value={data.timezone}
                                        onChange={(e) => setData('timezone', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.timezone && (
                                        <p className="text-sm text-red-600">{errors.timezone}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

PengaturanIndex.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengaturan Sistem', href: '/admin/pengaturan' },
    ],
});
