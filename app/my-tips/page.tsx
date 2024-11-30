import { Suspense } from 'react';

import { auth } from '#/auth';
import MyTipsList from '#/components/my-tips-list';
import UnauthorizedRequest from '#/components/unauthorized-request';

const MyTipsPage = async ({
    searchParams,
}: {
    searchParams: { page?: string };
}) => {
    const session = await auth();

    if (!session) {
        return (
            <UnauthorizedRequest description="Viewing your dev tips is allowed only for logged-in users." />
        );
    }

    const allSearchParams = await searchParams;
    const page = allSearchParams.page ? parseInt(allSearchParams.page) : 1;

    return (
        <div>
            My Tips list {page}
            <br />
            <Suspense fallback={<div>Loading...</div>}>
                <MyTipsList page={page} />
            </Suspense>
        </div>
    );
};

export default MyTipsPage;
