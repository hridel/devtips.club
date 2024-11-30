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

const MyTipCard = ({ tip }: { tip: Tip }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{tip.title}</CardTitle>
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
