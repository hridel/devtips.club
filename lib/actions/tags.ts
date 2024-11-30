'use server';

import { slug } from '@hridel/text-utils';
import { Tag } from '@prisma/client';

import { prisma } from '#/lib/db';

export const addNewTag = async (tagName: string): Promise<Tag | null> => {
    console.log('   ...wanna ad new tag: ', tagName);
    if (!tagName.length) {
        return null;
    }

    const tagSlug = slug(tagName);
    const existingTag = await prisma.tag.findUnique({
        where: {
            slug: tagSlug,
        },
    });

    if (existingTag) {
        return existingTag;
    }

    return await prisma.tag.create({
        data: {
            title: tagName,
            slug: tagSlug,
        },
    });
};

export const addMultipleTags = async (tagNames: string[]): Promise<Tag[]> => {
    const tags = await Promise.all(tagNames.map(addNewTag));
    console.log('   ...added multiple tags: ', tags);
    return tags.filter((tag): tag is Tag => tag !== null);
};
