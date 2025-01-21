import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    const token = process.env.ADMIN_AUTH_TOKEN;

    if (!authHeader || authHeader !== token) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.$executeRaw`REFRESH MATERIALIZED VIEW scoreboard`;
        return NextResponse.json({
            message:
                'Scoreboard refreshed successfully at ' +
                new Date().toISOString(),
        });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'Error refreshing scoreboard',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                error: error.message,
            },
            { status: 500 }
        );
    }
}
