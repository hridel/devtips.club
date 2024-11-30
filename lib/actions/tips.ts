'use server';

import { Tag, Tip } from '@prisma/client';

import { auth } from '#/auth';
import { addMultipleTags } from '#/lib/actions/tags';
import { prisma } from '#/lib/db';

export const createTip = async (
    data: Omit<
        Tip,
        'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > & { tags: string[] }
): Promise<Tip> => {
    const session = await auth();

    if (!session) {
        throw new Error('Unauthorized request');
    }

    const authorId = parseInt(session.user.id, 10);
    const { tags, ...tipData } = data;

    const createdTags: Tag[] = await addMultipleTags(tags);

    return await prisma.tip.create({
        data: {
            ...tipData,
            authorId,
            tags: {
                connect: createdTags.map((tag) => ({ id: tag.id })),
            },
        },
    });
};

export const updateTip = async (
    id: string,
    data: Omit<
        Tip,
        'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > & { tags: string[] }
): Promise<Tip> => {
    const session = await auth();

    if (!session) {
        throw new Error('Unauthorized request');
    }

    const authorId = parseInt(session.user.id, 10);

    const tip = await prisma.tip.findUnique({
        where: {
            id,
        },
    });

    if (!tip) {
        throw new Error('Tip not found');
    }

    if (tip.authorId !== authorId) {
        throw new Error('Unauthorized request');
    }

    const { tags, ...tipData } = data;
    console.log('update tip', 'tags', tags);
    const createdTags: Tag[] = await addMultipleTags(tags);

    return await prisma.tip.update({
        where: {
            id,
        },
        data: {
            ...tipData,
            tags: {
                set: createdTags.map((tag) => ({ id: tag.id })),
            },
        },
    });
};

export type DeleteMyTipState = 'deleted' | 'not-found' | 'unauthorized' | null;

export const deleteMyTip = async (
    currentState: DeleteMyTipState,
    formData: FormData
): Promise<DeleteMyTipState> => {
    const session = await auth();

    if (!session) {
        return 'unauthorized';
    }

    const authorId = parseInt(session.user.id, 10);

    const id = formData.get('id') as string;

    const tip = await prisma.tip.findUnique({
        where: {
            id,
        },
    });

    if (!tip) {
        return 'not-found';
    }

    if (tip.authorId !== authorId) {
        return 'unauthorized';
    }

    const result = await prisma.tip.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });

    return result ? 'deleted' : null;
};
