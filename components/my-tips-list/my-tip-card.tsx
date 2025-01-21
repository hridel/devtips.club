import { formatRelative } from 'date-fns';
import { CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { shortenText, stripHtmlTags } from '@hridel/text-utils';
import { Tip } from '@prisma/client';

import DeleteButton from '#/components/my-tips-list/delete-button';
import EditButton from '#/components/my-tips-list/edit-button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

import TipScore from '../tip-score';

interface MyTipCardProps {
    tip: Tip & { scoreboard: { score: number } };
}

const MyTipCard = (props: MyTipCardProps) => {
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
                    score={tip.scoreboard.score}
                />
                <span className="text-sm flex items-center text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {formatRelative(new Date(tip.createdAt), new Date())}
                </span>
            </CardHeader>
            <CardContent>
                <p>{shortenText(stripHtmlTags(tip.htmlContent), 200)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <DeleteButton tipId={tip.id} />
                <EditButton tipId={tip.id} />
            </CardFooter>
        </Card>
    );
};
export default MyTipCard;
