import { slug } from '@hridel/text-utils';

import { fetchTips } from '#/lib/services/tip';

const TipsPage = async ({
    searchParams,
}: {
    searchParams: { page?: string };
}) => {
    const allSearchParams = await searchParams;
    const page = allSearchParams.page ? parseInt(allSearchParams.page) : 1;
    const tips = await fetchTips(page);

    console.log(slug(`Pchnąć w tę łódź jeża lub ośm skrzyń fig.`));

    return (
        <div>
            Tips list {page}
            <br />
            <pre>{JSON.stringify(tips)}</pre>
        </div>
    );
};

export default TipsPage;
