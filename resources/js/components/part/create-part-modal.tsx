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
import { Test } from '@/types';
import { IoCloudUpload, IoCreate, IoMicOutline } from 'react-icons/io5';

export default function CreatePartModal({ test }: { test: Test }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const nameInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<{
        test_id: number;
        name: string;
        description: string;
        audio_path: string | File;
    }>({
        test_id: test.id,
        name: '',
        description: '',
        audio_path: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('part.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('success.created'));
            },
            onError: (err) => {
                nameInput.current?.focus();
                toast.error(err?.error || t('error.create_failed'));
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`${baseButton} group bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600`}
                >
                    <IoCreate className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">{t('test_table.add_section')}</span>
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-900">
                <div className="relative bg-slate-50/80 px-8 py-8 dark:bg-slate-800/40">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-inner">
                            <IoMicOutline className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                {t('test_table.new_section_title')}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('test_table.new_section_description')}
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
                            placeholder={t('test_table.enter_section_name')}
                            className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-4 transition-all focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                            {t('test_show.part_instructions')}
                        </Label>
                        <Input
                            id="description"
                            value={data.description}
                            placeholder={t('test_table.enter_instructions')}
                            className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-4 transition-all focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Audio File */}
                    <div className="space-y-2">
                        <Label htmlFor="audio_path" className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                            {t('test_show.audio_prompt')}
                        </Label>
                        <div className="group relative flex min-h-[100px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-950/50">
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
                                <IoCloudUpload className="h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                <span className="px-4 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                    {data.audio_path ? (data.audio_path as File).name : t('test_table.click_to_upload')}
                                </span>
                            </div>
                        </div>
                        <InputError message={errors.audio_path} />
                    </div>

                    <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800/50">
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                className="h-12 rounded-2xl px-6 font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
                            className="h-12 min-w-[120px] rounded-2xl bg-indigo-600 px-6 font-black text-white shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:shadow-none"
                        >
                            {processing ? t('common.saving') : t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
