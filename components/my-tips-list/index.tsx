import MyTipCard from '#/components/my-tips-list/my-tip-card';
import PaginationLinks from '#/components/pagination-links';
import { fetchMyTips } from '#/lib/services/tip';
import { cn } from '#/lib/utils';

export interface MyTipsListProps {
    page: number;
    className?: string;
}

const MyTipsList = async (props: MyTipsListProps) => {
    const { page, className } = props;
    const tips = await fetchMyTips(page);

    return (
        <div className={cn(className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tips.tips.map((tip) => (
                    <MyTipCard tip={tip} key={tip.id} />
                ))}
            </div>
            <PaginationLinks totalPages={tips.meta.totalPages} />
        </div>
    );
};

export default MyTipsList;
