'use server';

import { notFound } from 'next/navigation';
import { cache } from 'react';

import { auth } from '#/auth';
import { TipsListVariant, tipsListVariants } from '#/components/tips-list';
import { DEFAULT_PAGE_SIZE } from '#/lib/config';
import { prisma } from '#/lib/db';

const fetchLatestTips = async (page: number) => {
    const totalTips = await prisma.tip.count({
        where: { deletedAt: null },
    });

    const tips = await prisma.tip.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        include: {
            author: true,
            tags: true,
            scoreboard: { select: { score: true } },
        },
    });

    return {
        tips,
        meta: {
            totalTips,
            totalPages: Math.ceil(totalTips / DEFAULT_PAGE_SIZE),
            currentPage: page,
        },
    };
};

const fetchTopRatedTips = async (page: number) => {
    const totalTips = await prisma.scoreboard.count();

    const tips = await prisma.scoreboard.findMany({
        orderBy: { score: 'desc' },
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        include: { tip: { include: { author: true, tags: true } } },
    });

    return {
        tips,
        meta: {
            totalTips,
            totalPages: Math.ceil(totalTips / DEFAULT_PAGE_SIZE),
            currentPage: page,
        },
    };
};

export const fetchTips = async (page: number, variant: TipsListVariant) => {
    switch (variant) {
        default:
        case tipsListVariants.latest:
            return fetchLatestTips(page);
        case tipsListVariants.topRated:
            return fetchTopRatedTips(page);
    }
};

export const fetchTipById = async (id: string) => {
    const tip = await prisma.tip.findUnique({
        where: { id, deletedAt: null },
        include: { author: true, tags: true },
    });

    if (!tip) notFound();
    return tip;
};

export const fetchMyTips = async (page: number) => {
    const session = await auth();

    if (!session) {
        throw new Error('Unauthorized request');
    }

    const authorId = parseInt(session.user.id, 10);

    const totalTips = await prisma.tip.count({
        where: { deletedAt: null, authorId },
    });

    const tips = await prisma.tip.findMany({
        where: { deletedAt: null, authorId },
        take: DEFAULT_PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        include: { author: true, scoreboard: { select: { score: true } } },
    });

    return {
        tips,
        meta: {
            totalTips,
            totalPages: Math.ceil(totalTips / DEFAULT_PAGE_SIZE),
            currentPage: page,
        },
    };
};

export const fetchTipsByAuthorId = async (authorId: number, page: number) => {
    const totalTips = await prisma.tip.count({
        where: { deletedAt: null, authorId: authorId },
    });

    const tips = await prisma.tip.findMany({
        where: { deletedAt: null, authorId: authorId },
        take: DEFAULT_PAGE_SIZE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        include: { author: true },
    });

    return {
        tips,
        meta: {
            totalTips,
            totalPages: Math.ceil(totalTips / DEFAULT_PAGE_SIZE),
            currentPage: page,
        },
    };
};

export const getTipById = cache(fetchTipById);
