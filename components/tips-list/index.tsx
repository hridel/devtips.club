import PaginationLinks from '#/components/pagination-links';
import TipCard from '#/components/tips-list/tip-card';
import { fetchTips } from '#/lib/services/tip';
import { cn } from '#/lib/utils';

export const tipsListVariants = {
    latest: 'latest',
    topRated: 'topRated',
} as const;

export type TipsListVariant =
    (typeof tipsListVariants)[keyof typeof tipsListVariants];

export interface TipsListProps {
    page: number;
    variant: TipsListVariant;
    className?: string;
}

const TipsList = async (props: TipsListProps) => {
    const { page, variant, className } = props;
    const tips = await fetchTips(page, variant);

    return (
        <div className={cn(className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tips.tips.map((tip) => (
                    <TipCard tip={tip} key={tip.id} />
                ))}
            </div>
            <PaginationLinks totalPages={tips.meta.totalPages} />
        </div>
    );
};

export default TipsList;
