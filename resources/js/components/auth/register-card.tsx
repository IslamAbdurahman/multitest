import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import SocialSignIn from '@/components/auth/SocialSignIn';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    phone: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function RegisterCard() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            {/* 🔑 Social Login Section */}
            <SocialSignIn />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 font-bold text-slate-400 dark:bg-slate-950">{t('register.or')}</span>
                </div>
            </div>

            {/* 📝 Registration Form */}
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-4">
                    {/* Name */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('register.name')}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.name_placeholder')}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Phone */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="phone" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('common.phone')}
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            tabIndex={2}
                            autoComplete="tel"
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder={t('common.phone_placeholder')}
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('register.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={3}
                            autoComplete="email"
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.email_placeholder')}
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password" self-id="password_label" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('register.password')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.password_placeholder')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Password Confirmation */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password_confirmation" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('register.password_confirmation')}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            className="h-12 rounded-xl border-slate-200 dark:border-slate-800"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.password_confirmation_placeholder')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-4 h-12 w-full rounded-xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 dark:shadow-none"
                        tabIndex={6}
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {t('register.submit')}
                    </Button>
                </div>

                {/* Footer Links */}
                <div className="mt-2 text-center text-sm font-medium text-slate-500">
                    {t('register.no_account')}{' '}
                    <TextLink href={route('login')} tabIndex={7} className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                        {t('register.login')}
                    </TextLink>
                </div>
            </form>
        </div>
    );
}
