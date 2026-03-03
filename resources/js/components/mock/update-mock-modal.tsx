import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { baseButton } from '@/components/ui/baseButton';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Mock } from '@/types';
import { Activity, Calendar, Headphones, LayoutGrid, Lock, Pencil, UploadCloud } from 'lucide-react';

interface UpdateMockModalProps {
    mock: Mock;
}

interface MockUpdateForm {
    [key: string]: string | number | File | undefined | null;
    name: string;
    description: string;
    audio_path: string | File;
    starts_at: string;
    active: number;
    open: number;
    _method: 'PUT';
}

export default function UpdateMockModal({ mock }: UpdateMockModalProps) {
    const { t } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<MockUpdateForm>({
        name: mock.name,
        description: mock.description ?? '',
        audio_path: '',
        starts_at: mock.starts_at ?? '',
        active: mock.active,
        open: mock.open,
        _method: 'PUT',
    });

    // Ensure form is fresh when modal opens or mock changes
    useEffect(() => {
        if (open) {
            setData({
                name: mock.name,
                description: mock.description ?? '',
                audio_path: '',
                starts_at: mock.starts_at ?? '',
                active: mock.active,
                open: mock.open,
                _method: 'PUT',
            });
        }
    }, [open, mock, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('mock.update', mock.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
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
                className={`${baseButton} flex h-9 w-9 items-center justify-center border border-slate-200 bg-white p-0 text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/40`}
            >
                <Pencil className="h-4 w-4 shrink-0" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex max-h-[95vh] !w-[1000px] !max-w-[95vw] flex-col gap-0 overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-900">
                    {/* Header (Fixed) */}
                    <div className="flex-none border-b border-slate-100 bg-slate-50/80 px-10 py-8 dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none">
                                <LayoutGrid className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {t('modal.update_mock_title')}
                                </DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                                    {t('modal.update_mock_description')}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                        {/* Scrollable Body */}
                        <div className="flex-1 space-y-8 overflow-y-auto p-10">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{t('common.name')}</Label>
                                        <Input
                                            ref={nameInput}
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold dark:border-slate-800 dark:bg-slate-950"
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
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold dark:border-slate-800 dark:bg-slate-950"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                            <Headphones className="h-3.5 w-3.5 text-indigo-500" />
                                            {t('mock_table.intro_audio')}
                                        </Label>
                                        <div className="group relative flex h-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-950">
                                            <UploadCloud className="absolute left-4 h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                            <span className="max-w-[200px] truncate pl-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                {data.audio_path ? (data.audio_path as File).name : t('common.replace_audio_optional')}
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
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold dark:border-slate-800 dark:bg-slate-950"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                        />
                                        <InputError message={errors.starts_at} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                        <Activity className="h-3.5 w-3.5 text-emerald-500" />
                                        {t('mock_table.active_status')}
                                    </Label>
                                    <select
                                        value={String(data.active)}
                                        onChange={(e) => setData('active', Number(e.target.value))}
                                        className="block h-14 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                    >
                                        <option value={0}>{t('common.no')}</option>
                                        <option value={1}>{t('common.yes')}</option>
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
                                        onChange={(e) => setData('open', Number(e.target.value))}
                                        className="block h-14 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 font-bold shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950"
                                    >
                                        <option value={0}>{t('common.no')}</option>
                                        <option value={1}>{t('common.yes')}</option>
                                    </select>
                                    <InputError message={errors.open} />
                                </div>
                            </div>
                        </div>

                        {/* Footer (Fixed) */}
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
                                    className="h-12 min-w-[160px] rounded-2xl bg-indigo-600 px-8 font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 dark:bg-indigo-500"
                                >
                                    {processing ? t('common.updating') : t('mock_table.update_mock')}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
