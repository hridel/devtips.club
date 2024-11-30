import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Tag, Tip, User } from '@prisma/client';

import { auth } from '#/auth';
import RenderHtmlBlock from '#/components/render-html-block';
import { getTipById } from '#/lib/services/tip';

const TipDetailPage = async ({ params }: { params: { id: string } }) => {
    const allParams = await params;

    const tipData: Tip & { author: User; tags: Tag[] } = await getTipById(
        allParams.id
    );
    if (!tipData) {
        notFound();
    }

    const session = await auth();

    return (
        <div>
            <pre>{JSON.stringify(allParams)}</pre>
            <br />
            <pre>{JSON.stringify(tipData)}</pre>
            <br />
            <RenderHtmlBlock htmlString={tipData.htmlContent} />
            {session && session.user.id === tipData.author.id.toString() && (
                <Link href={`/tips/${tipData.id}/edit`}>Edit</Link>
            )}
        </div>
    );
};

export default TipDetailPage;
