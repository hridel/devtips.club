import TipsList, { tipsListVariants } from '#/components/tips-list';

const TipsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) => {
    const allSearchParams = await searchParams;
    const page = allSearchParams.page ? parseInt(allSearchParams.page) : 1;

    return (
        <div>
            Tips list {page}
            <br />
            <TipsList page={page} variant={tipsListVariants.latest} />
        </div>
    );
};

export default TipsPage;
