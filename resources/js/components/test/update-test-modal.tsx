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
import { Language, Test } from '@/types';
import { Lock, Pencil, RotateCcw } from 'lucide-react';

interface UpdateTestModalProps {
    test: Test;
}

export default function UpdateTestModal({ test }: UpdateTestModalProps) {
    const { t, i18n } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const [languages, setLanguages] = useState<Language[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState(false);

    // Fetch languages
    useEffect(() => {
        if (!open) return;

        const fetchLanguages = async () => {
            setLoadingLanguages(true);
            try {
                const response = await fetch(route('language.all.json'));
                const result = await response.json();

                const list: Language[] = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [];

                setLanguages(list);
            } catch (error) {
                console.error(error);
                setLanguages([]);
            } finally {
                setLoadingLanguages(false);
            }
        };

        fetchLanguages();
    }, [open]);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<{
        name: string;
        language_id: number;
        description: string;
        audio_path: string | File;
        is_public: number;
        _method: 'PUT';
    }>({
        name: test.name,
        language_id: test.language_id, // This ensures the current ID is selected on init
        description: test.description || '',
        audio_path: '',
        is_public: test.is_public ? 1 : 0,
        _method: 'PUT',
    });

    // Ensure form data stays synced if the 'test' prop updates
    useEffect(() => {
        setData({
            name: test.name,
            language_id: test.language_id,
            description: test.description || '',
            audio_path: '',
            is_public: test.is_public ? 1 : 0,
            _method: 'PUT',
        });
    }, [test]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('test.update', test.id), {
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
                className={`${baseButton} flex h-9 w-9 items-center justify-center border border-slate-200 bg-white p-0 text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400`}
            >
                <Pencil className="h-4 w-4 shrink-0" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl transition-all dark:bg-slate-900">
                    <div className="bg-slate-50/80 px-8 py-6 dark:bg-slate-800/40">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                                <Pencil className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {t('test_table.update_title')}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {t('test_table.update_description')}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6 p-8">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
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

                        {/* Language - Pre-selected via data.language_id */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="language_id"
                                className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500"
                            >
                                {t('common.language')}
                            </Label>
                            <select
                                id="language_id"
                                value={data.language_id}
                                className="block h-12 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                onChange={(e) => setData('language_id', parseInt(e.target.value))}
                            >
                                <option value="0" disabled>
                                    {loadingLanguages ? t('common.loading') : t('test_table.select_language')}
                                </option>
                                {languages.map((lang) => {
                                    // Determine which name field to show based on current locale
                                    // Falls back to name_en if the current language field is missing
                                    const displayName = i18n.language === 'uz' ? lang.name_uz : i18n.language === 'ru' ? lang.name_ru : lang.name_en;

                                    return (
                                        <option key={lang.id} value={lang.id}>
                                            {displayName}
                                        </option>
                                    );
                                })}
                            </select>
                            <InputError message={errors.language_id} />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500"
                            >
                                {t('common.description')}
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-4 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* Audio Upload */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="audio_path"
                                className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500"
                            >
                                {t('test_table.audio_file')}
                            </Label>
                            <div className="group relative flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-indigo-500/50">
                                <Input
                                    type="file"
                                    id="audio_path"
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setData('audio_path', e.target.files[0]);
                                        }
                                    }}
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="rounded-full bg-white p-2 shadow-sm dark:bg-slate-800">
                                        <RotateCcw className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <span className="px-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                        {data.audio_path ? (data.audio_path as File).name : t('test_table.replace_audio_optional')}
                                    </span>
                                </div>
                            </div>
                            <InputError message={errors.audio_path} />
                        </div>

                        {/* Public */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                <Lock className="h-3.5 w-3.5 text-blue-500" />
                                {t('common.public')}
                            </Label>

                            <label className="relative flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-6 transition-all hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/50">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={Boolean(data.is_public)}
                                    onChange={(e) => setData('is_public', e.target.checked ? 1 : 0)}
                                />
                                <div className="peer relative h-6 w-11 rounded-full bg-slate-300 peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-500/20 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-slate-600 dark:bg-slate-700"></div>

                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                    {data.is_public ? t('common.yes') : t('common.no')}
                                </span>
                            </label>

                            <InputError message={errors.is_public} />
                        </div>

                        <DialogFooter className="mt-2 flex flex-row items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800/50">
                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    type="button"
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
                                className="h-11 min-w-[120px] rounded-xl bg-indigo-600 px-6 font-black text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:shadow-none"
                            >
                                {processing ? t('common.updating') : t('test_table.update_test')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
