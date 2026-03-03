import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import SocialSignIn from '@/components/auth/SocialSignIn';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email_or_phone: string;
    password: string;
    remember: boolean;
};

export default function LoginCard() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email_or_phone: '',
        password: '',
        remember: false,
    });

    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
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
                    <span className="bg-white px-3 font-bold text-slate-400 dark:bg-slate-950">{t('login.or')}</span>
                </div>
            </div>

            {/* 📝 Main Login Form */}
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-5">
                    {/* Identifier Input (Email or Phone) */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="email_or_phone" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('login.email_or_phone')}
                        </Label>
                        <Input
                            id="email_or_phone"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800"
                            value={data.email_or_phone}
                            onChange={(e) => setData('email_or_phone', e.target.value)}
                            placeholder={t('login.email_placeholder')}
                        />
                        <InputError message={errors.email_or_phone} />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {t('login.password_label')}
                            </Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('login.password_placeholder')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Me Toggle */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            tabIndex={3}
                            className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            {t('login.remember')}
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-2 h-12 w-full rounded-xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 dark:shadow-none"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {t('login.submit')}
                    </Button>
                </div>

                {/* Registration Link */}
                <div className="mt-2 text-center text-sm font-medium text-slate-500">
                    {t('login.no_account')}{' '}
                    <TextLink href={route('register')} tabIndex={5} className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                        {t('login.signup')}
                    </TextLink>
                </div>
            </form>
        </div>
    );
}
