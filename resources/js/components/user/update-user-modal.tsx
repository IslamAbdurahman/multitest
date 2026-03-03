import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Role, User } from '@/types';
import { Lock, Mail, Pencil, Phone, Shield, UserCog } from 'lucide-react';

interface UpdateUserModalProps {
    user: User;
}

export default function UpdateUserModal({ user }: UpdateUserModalProps) {
    const { t } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        name: user.name,
        role: user.roles?.[0]?.name ?? '',
        phone: user.phone,
        email: user.email,
        password: '',
    });

    useEffect(() => {
        if (open) {
            setData({
                name: user.name,
                phone: user.phone,
                email: user.email,
                password: '',
                role: user.roles?.[0]?.name ?? '',
            });

            const fetchRoles = async () => {
                try {
                    const response = await fetch(route('role.all.json'));
                    const result = await response.json();
                    const list: Role[] = Array.isArray(result) ? result : result.data || [];
                    setRoles(list);
                } catch (error) {
                    setRoles([]);
                }
            };
            fetchRoles();
        }
    }, [open, user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('user.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('success.updated'));
            },
            onError: (err) => {
                nameInput.current?.focus();
                toast.error(err?.error || t('error.update_failed'));
            },
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                type="button"
                title={t('common.edit')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/40"
            >
                <Pencil className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex max-h-[95vh] !w-[600px] !max-w-[95vw] flex-col gap-0 overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-950">
                    {/* Header */}
                    <div className="flex-none border-b border-slate-100 bg-slate-50/80 px-10 py-8 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <UserCog className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {t('user_management.edit_user_title')}
                                </DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                                    {t('user_management.modifying_account_for')}{' '}
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.name}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-6 overflow-y-auto p-10">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
                                >
                                    {t('common.full_name')}
                                </Label>
                                <Input
                                    id="name"
                                    ref={nameInput}
                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 px-4 font-bold focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Phone Input */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
                                    >
                                        <Phone className="h-3 w-3" /> {t('user_management.phone')}
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50 px-4 font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                {/* Role Select */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="role"
                                        className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
                                    >
                                        <Shield className="h-3 w-3" /> {t('common.role')}
                                    </Label>
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="h-12 w-full rounded-xl border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="">{t('user_management.select_role')}</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role} />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
                                >
                                    <Mail className="h-3 w-3" /> {t('common.email')}
                                </Label>
                                <Input
                                    id="email"
                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 px-4 font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Input (Optional) */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
                                >
                                    <Lock className="h-3 w-3" /> {t('user_management.reset_password')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={t('user_management.leave_blank_to_keep')}
                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 px-4 font-medium dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        {/* Footer Action */}
                        <DialogFooter className="flex-none border-t border-slate-100 bg-slate-50/80 px-10 py-6 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex w-full items-center justify-end gap-3">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-12 rounded-2xl px-8 font-bold text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                                        onClick={() => {
                                            reset();
                                            clearErrors();
                                            setOpen(false);
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 min-w-[140px] rounded-2xl bg-indigo-600 px-8 font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 dark:bg-indigo-500"
                                >
                                    {processing ? t('common.saving') : t('common.save_changes')}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
