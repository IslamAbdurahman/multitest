import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { GroupBase, MultiValue, StylesConfig } from 'react-select';

import InputError from '@/components/input-error';
import { baseButton } from '@/components/ui/baseButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Mock, Test } from '@/types';
import { BookPlus, Library, Search } from 'lucide-react';

interface CreateMockTestModalProps {
    mock: Mock;
}

interface OptionType {
    value: number;
    label: string;
}

export default function CreateMockTestModal({ mock }: CreateMockTestModalProps) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<{
        mock_id: number;
        testIds: number[];
    }>({
        mock_id: mock.id,
        testIds: [],
    });

    useEffect(() => {
        if (!open) return;

        const fetchTests = async () => {
            setLoading(true);
            try {
                const response = await fetch(route('test.all.json', { mock_id: mock.id }));
                const result = await response.json();

                const list: Test[] = Array.isArray(result)
                    ? result
                    : Array.isArray(result.data)
                      ? result.data
                      : Array.isArray(result.tests)
                        ? result.tests
                        : [];

                setTests(list);
            } catch (error) {
                console.error(error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [open, mock.id]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('mock-test.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('success.created'));
            },
            onError: (err) => {
                toast.error(err?.error || t('error.create_failed'));
            },
        });
    };

    /* =========================
       REACT-SELECT DESIGN & FIXES
    ========================= */
    const options: OptionType[] = tests.map((test) => ({
        value: test.id,
        label: test.name,
    }));

    const selectedOptions: OptionType[] = options.filter((opt) => data.testIds.includes(opt.value));
    const isDark = document.documentElement.classList.contains('dark');

    const customStyles: StylesConfig<OptionType, true, GroupBase<OptionType>> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
            borderColor: state.isFocused ? '#6366f1' : isDark ? '#1e293b' : '#e2e8f0',
            borderRadius: '1rem',
            padding: '4px 12px',
            minHeight: '56px',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#6366f1',
            },
        }),
        input: (base) => ({
            ...base,
            color: isDark ? '#f8fafc' : '#0f172a',
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark ? '#f8fafc' : '#0f172a',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            zIndex: 9999,
            marginTop: '8px',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? (isDark ? '#1e293b' : '#f1f5f9') : 'transparent',
            color: state.isSelected ? '#ffffff' : isDark ? '#cbd5e1' : '#475569',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: isDark ? '#312e81' : '#e0e7ff',
            borderRadius: '8px',
            padding: '2px 4px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: isDark ? '#e0e7ff' : '#4338ca',
            fontWeight: '700',
            fontSize: '12px',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#6366f1',
            borderRadius: '6px',
            '&:hover': {
                backgroundColor: '#ef4444',
                color: '#ffffff',
            },
        }),
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                type="button"
                className={`${baseButton} flex h-9 w-9 items-center justify-center border border-slate-200 bg-white p-0 text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-900/40`}
            >
                <BookPlus className="h-4 w-4 shrink-0" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex max-h-[90vh] !w-[600px] !max-w-[95vw] flex-col gap-0 overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-slate-900">
                    <div className="flex-none border-b border-slate-100 bg-slate-50/80 px-10 py-8 dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                                <Library className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {t('modal.assign_tests')}
                                </DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                                    {t('modal.assign_tests_description')}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-6 p-10">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    <Search className="h-3.5 w-3.5" />
                                    {t('mock_table.select_tests')}
                                </Label>

                                <Select
                                    isMulti
                                    options={options}
                                    value={selectedOptions}
                                    onChange={(selected: MultiValue<OptionType>) => {
                                        setData(
                                            'testIds',
                                            selected.map((s) => s.value),
                                        );
                                    }}
                                    isLoading={loading}
                                    styles={customStyles}
                                    placeholder={t('mock_table.search_and_select_tests')}
                                    noOptionsMessage={() => t('common.no_data')}
                                    classNamePrefix="react-select"
                                />

                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        {t('mock_table.currently_selected')}:{' '}
                                        <span className="text-indigo-600 dark:text-indigo-400">{data.testIds.length}</span>
                                    </p>
                                    {loading && <span className="animate-pulse text-[10px] font-bold text-indigo-500">{t('common.loading')}</span>}
                                </div>
                                <InputError message={errors.testIds} />
                            </div>
                        </div>

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
                                    disabled={processing || loading || data.testIds.length === 0}
                                    className="h-12 min-w-[140px] rounded-2xl bg-indigo-600 px-8 font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 dark:bg-indigo-500"
                                >
                                    {processing ? t('mock_table.assigning') : t('mock_table.assign_tests')}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
