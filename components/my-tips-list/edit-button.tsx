'use client';

import { useRouter } from 'next/navigation';

import { Button } from '#/components/ui/button';

const EditButton = ({ tipId }: { tipId: string }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/tips/${tipId}/edit`);
    };

    return (
        <Button variant="outline" onClick={handleClick}>
            Edit
        </Button>
    );
};

export default EditButton;
