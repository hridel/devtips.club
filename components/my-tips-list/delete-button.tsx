'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '#/components/ui/alert-dialog';
import { Button, buttonVariants } from '#/components/ui/button';
import { deleteMyTip } from '#/lib/actions/tips';
import { toast } from '#/lib/hooks/use-toast';

const DeleteButton = ({ tipId }: { tipId: string }) => {
    const [state, formAction, pending] = useActionState(deleteMyTip, null);
    const router = useRouter();

    useEffect(() => {
        if (state === 'deleted') {
            router.refresh();
        } else if (state === 'not-found' || state === 'unauthorized') {
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the tip',
                variant: 'destructive',
            });
        }
    }, [router, state]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={pending}
                >
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form action={formAction}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your dev-tip.
                            <input type="hidden" name="id" value={tipId} />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            type="submit"
                            disabled={pending}
                            className={buttonVariants({
                                variant: 'destructive',
                            })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteButton;
