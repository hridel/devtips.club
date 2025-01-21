import { formatRelative } from 'date-fns';
import { CalendarDays, ExternalLink, Tags } from 'lucide-react';
import Link from 'next/link';

import { shortenText, stripHtmlTags } from '@hridel/text-utils';
import { Tag, Tip } from '@prisma/client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

import TipScore from '../tip-score';

interface TipCardProps {
    tip: Tip & { tags: Tag[]; scoreboard: { score: number | null } | null };
}

const TipCard = (props: TipCardProps) => {
    const { tip } = props;
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>
                    <Link
                        target="_blank"
                        href={`/tips/${tip.id}`}
                        className="underline underline-offset-2 hover:no-underline flex items-start"
                    >
                        <span>{tip.title}</span>
                        <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                </CardTitle>
                <TipScore
                    className="absolute -top-1 right-0"
                    tipId={tip.id}
                    score={tip.scoreboard?.score || 0}
                />
                <span className="flex items-center text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {formatRelative(new Date(tip.createdAt), new Date())}
                </span>
            </CardHeader>
            <CardContent>
                <p>{shortenText(stripHtmlTags(tip.htmlContent), 200)}</p>
            </CardContent>
            <CardFooter className="text-muted-foreground flex flex-wrap gap-2">
                <Tags className="w-4 h-4 mr-2" />
                {tip.tags.map((tag) => (
                    <Link
                        className="text-sm underline underline-offset-2 hover:no-underline"
                        href={`/tags/${tag.slug}`}
                        key={tag.id}
                    >
                        {tag.title}
                    </Link>
                ))}
            </CardFooter>
        </Card>
    );
};
export default TipCard;
