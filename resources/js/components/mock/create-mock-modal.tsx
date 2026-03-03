import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { baseButton } from '@/components/ui/baseButton';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Activity, Calendar, Headphones, LayoutGrid, Lock, UploadCloud } from 'lucide-react';
import { IoCreate } from 'react-icons/io5';

// ESLint-safe interface
interface MockCreateForm {
    [key: string]: string | number | File | undefined | null;
    name: string;
    description: string;
    starts_at: string;
    active: number;
    open: number;
    audio_path: string | File;
}

export default function CreateMockModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<MockCreateForm>({
        name: '',
        description: '',
        starts_at: '',
        active: 0,
        open: 0,
        audio_path: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('mock.store'), {
            forceFormData: true, // Crucial for audio file upload
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('success.created'));
            },
            onError: (err) => {
                nameInput.current?.focus();
                const errorMessage = err?.error || t('error.create_failed');
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`${baseButton} flex items-center justify-center gap-2 bg-indigo-600 px-5 py-2.5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-600`}
                >
                    <IoCreate className="h-4 w-4" />
                    <span className="text-xs font-black tracking-widest uppercase">{t('mock_table.create_mock')}</span>
                </button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[95vh] !w-[1000px] !max-w-[95vw] flex-col gap-0 overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-900">
                {/* 1. Header (Fixed) */}
                <div className="flex-none border-b border-slate-100 bg-slate-50/80 px-10 py-8 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                            <LayoutGrid className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                {t('modal.create_mock_title')}
                            </DialogTitle>
                            <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                                {t('modal.create_mock_description')}
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                    {/* 2. Scrollable Body */}
                    <div className="flex-1 space-y-8 overflow-y-auto p-10">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{t('common.name')}</Label>
                                    <Input
                                        ref={nameInput}
                                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        {t('common.description')}
                                    </Label>
                                    <Input
                                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* Media Info */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        <Headphones className="h-3.5 w-3.5 text-indigo-500" />
                                        {t('mock_table.intro_audio')}
                                    </Label>
                                    <div className="group relative flex h-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-950">
                                        <UploadCloud className="absolute left-4 h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                        <span className="max-w-[200px] truncate pl-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {data.audio_path ? (data.audio_path as File).name : t('common.upload_audio')}
                                        </span>
                                        <Input
                                            type="file"
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setData('audio_path', e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                    <InputError message={errors.audio_path} />
                                </div>

                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                        {t('mock_table.starts_at')}
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                    />
                                    <InputError message={errors.starts_at} />
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                                    {t('mock_table.active_status')}
                                </Label>
                                <select
                                    value={String(data.active)}
                                    onChange={(e) => setData('active', parseInt(e.target.value, 10))}
                                    className="block h-14 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <option value={0}>{t('common.inactive')}</option>
                                    <option value={1}>{t('common.active')}</option>
                                </select>
                                <InputError message={errors.active} />
                            </div>

                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                                    {t('mock_table.availability')}
                                </Label>
                                <select
                                    value={String(data.open)}
                                    onChange={(e) => setData('open', parseInt(e.target.value, 10))}
                                    className="block h-14 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <option value={0}>{t('common.closed')}</option>
                                    <option value={1}>{t('common.open')}</option>
                                </select>
                                <InputError message={errors.open} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Footer (Fixed) */}
                    <DialogFooter className="flex-none border-t border-slate-100 bg-slate-50/80 px-10 py-6 dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="flex w-full items-center justify-end gap-3">
                            <DialogClose asChild>
                                <Button
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
                                className="h-12 min-w-[160px] rounded-2xl bg-indigo-600 px-8 font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:shadow-none"
                            >
                                {processing ? t('common.processing') : t('mock_table.save_mock')}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
