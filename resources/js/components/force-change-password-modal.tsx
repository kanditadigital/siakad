import { Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password/force-change';

type PageProps = {
    auth: { user: { must_change_password: boolean } | null };
    passwordRules: string;
};

/**
 * Blocking modal shown on the dashboard for an account whose password is
 * still its first-login default (NIDN for dosen, NIM for mahasiswa) — the
 * `ForcePasswordChange` middleware redirects every other route to the
 * dedicated full-page form, this covers the one route it exempts.
 */
export default function ForceChangePasswordModal() {
    const { props } = usePage<PageProps>();
    const open = props.auth.user?.must_change_password ?? false;

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Ganti password Anda</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ini adalah pertama kali Anda masuk. Untuk keamanan akun,
                        silakan ganti password default sebelum melanjutkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Form
                    {...update.form()}
                    resetOnSuccess={[
                        'current_password',
                        'password',
                        'password_confirmation',
                    ]}
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="modal_current_password">
                                    Password saat ini
                                </Label>
                                <PasswordInput
                                    id="modal_current_password"
                                    name="current_password"
                                    autoComplete="current-password"
                                    autoFocus
                                    placeholder="Password saat ini"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="modal_password">
                                    Password baru
                                </Label>
                                <PasswordInput
                                    id="modal_password"
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder="Password baru"
                                    passwordrules={props.passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="modal_password_confirmation">
                                    Konfirmasi password baru
                                </Label>
                                <PasswordInput
                                    id="modal_password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder="Konfirmasi password baru"
                                    passwordrules={props.passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <AlertDialogFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                    data-test="force-password-change-modal-button"
                                >
                                    {processing && <Spinner />}
                                    Ganti password
                                </Button>
                            </AlertDialogFooter>
                        </div>
                    )}
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
