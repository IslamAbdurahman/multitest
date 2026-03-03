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
import { Part } from '@/types';
import { AlignLeft, Music, Pencil, RefreshCcw } from 'lucide-react';

interface UpdatePartModalProps {
    part: Part;
}

export default function UpdatePartModal({ part }: UpdatePartModalProps) {
    const { t } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<{
        name: string;
        description: string;
        audio_path: string | File;
        _method: 'PUT' | 'POST';
    }>({
        name: part.name,
        description: part.description || '',
        audio_path: '',
        _method: 'PUT',
    });

    useEffect(() => {
        if (open) {
            setData({
                name: part.name,
                description: part.description || '',
                audio_path: '',
                _method: 'PUT',
            });
        }
    }, [part, open]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('part.update', part.id), {
            forceFormData: true,
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
                className={`${baseButton} flex h-9 w-9 items-center justify-center border border-slate-200 bg-white p-0 text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400`}
            >
                <Pencil className="h-4 w-4 shrink-0" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-900">
                    <div className="bg-slate-50/80 px-8 py-7 dark:bg-slate-800/40">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
                                <RefreshCcw className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {t('test_table.update_section_title')}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {t('test_table.update_section_description')}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6 p-8">
                        {/* Part Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                {t('common.name')}
                            </Label>
                            <Input
                                id="name"
                                ref={nameInput}
                                value={data.name}
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-4 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500"
                            >
                                {t('test_show.part_instructions')}
                            </Label>
                            <div className="relative">
                                <AlignLeft className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
                                <Input
                                    id="description"
                                    value={data.description}
                                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.description} />
                        </div>

                        {/* Audio Upload */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="audio_path"
                                className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500"
                            >
                                {t('test_show.audio_prompt')}
                            </Label>
                            <div className="group relative flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-950/50">
                                <Input
                                    type="file"
                                    id="audio_path"
                                    accept="audio/*"
                                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setData('audio_path', e.target.files[0]);
                                        }
                                    }}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <Music className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="px-4 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                        {data.audio_path ? (data.audio_path as File).name : t('test_table.replace_audio_optional')}
                                    </span>
                                </div>
                            </div>
                            <InputError message={errors.audio_path} />
                        </div>

                        <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800/50">
                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    className="h-11 rounded-xl px-6 font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
                                className="h-11 min-w-[140px] rounded-xl bg-indigo-600 px-6 font-black text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:shadow-none"
                            >
                                {processing ? t('common.updating') : t('common.save_changes')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
