import DeleteItemModal from '@/components/delete-item-modal';
import CreatePartModal from '@/components/part/create-part-modal';
import UpdatePartModal from '@/components/part/update-part-modal';
import { Auth, Test } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface PartTableProps {
    test: Test;
}

const PartTable = ({ test }: PartTableProps) => {
    const { t } = useTranslation(); // Using the translation hook

    const { auth } = usePage().props as unknown as { auth?: Auth };

    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');
    const isTeacher = auth?.user?.roles?.some((role) => role.name === 'Teacher');

    const { delete: deletePart, reset, errors: deleteError, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deletePart(route('part.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('deleted_successfully')); // Success message
            },
            onError: (err) => {
                // Display a friendly error message if available
                const errorMessage = err?.error || t('delete_failed'); // Use fallback error message
                toast.error(errorMessage); // Display error message
            },
        });
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('part')}</h2>
                {(isAdmin || isTeacher) && <CreatePartModal test={test} />}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {test.parts?.map((item, index) => {
                    const globalIndex = index + 1;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    <Link href={`/part/${item.id}`}>{item.name}</Link>
                                </h3>
                                <span className="text-xs text-gray-500">#{globalIndex}</span>
                            </div>

                            {/* Comment */}
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description || t('no_description')}</p>

                            <div>
                                <audio preload="none" controls className="mt-4 w-full">
                                    <source src={item.audio_path} />
                                    {t('your_browser_does_not_support_audio')}
                                </audio>
                            </div>

                            {/* Actions */}
                            {(isAdmin || isTeacher) && (
                                <div className="mt-4 flex gap-2">
                                    <UpdatePartModal part={item} />

                                    <DeleteItemModal item={item} onDelete={handleDelete} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PartTable;
