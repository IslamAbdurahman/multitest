import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from 'lucide-react';
import React from 'react';
import { baseButton } from '@/components/ui/baseButton';

interface DeleteItemModalProps {
    item: { id: number, name?: string };
    onDelete: (id: number) => void; // Callback function to handle deletion
}

export default function DeleteItemModal({ item, onDelete }: DeleteItemModalProps) {
    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);

    const handleDelete = () => {
        onDelete(item.id); // Call the onDelete function passed as a prop
        setOpen(false); // Close the modal
    };

    const handleDeleteClick = () => {
        setOpen(true); // Open the delete modal
    };

    return (
        <>
            <button
                onClick={handleDeleteClick}
                className={` ${baseButton} gap-0 bg-red-600 p-2 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600`}
            >
                <TrashIcon className="h-4 w-4" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>{t('modal.delete_title')}</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <p>{t('modal.delete_confirmation')}</p>
                            <p className="font-medium">
                                {t('delete')} {item.name}
                            </p>
                        </div>
                    </DialogDescription>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={() => setOpen(false)}>
                                {t('cancel')}
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
