import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password/force-change';

type Props = {
    passwordRules: string;
};

export default function ForcePasswordChange({ passwordRules }: Props) {
    return (
        <>
            <Head title="Ganti password" />

            <Form
                {...update.form()}
                resetOnSuccess={[
                    'current_password',
                    'password',
                    'password_confirmation',
                ]}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">
                                Password saat ini
                            </Label>
                            <PasswordInput
                                id="current_password"
                                name="current_password"
                                autoComplete="current-password"
                                autoFocus
                                placeholder="Password saat ini"
                            />
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password baru</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="Password baru"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Konfirmasi password baru
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Konfirmasi password baru"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="force-password-change-button"
                        >
                            {processing && <Spinner />}
                            Ganti password
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ForcePasswordChange.layout = {
    title: 'Ganti password Anda',
    description:
        'Ini adalah pertama kali Anda masuk. Untuk keamanan akun, silakan ganti password default sebelum melanjutkan.',
};
