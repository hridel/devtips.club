import { auth } from '#/auth';
import DevTipForm from '#/components/dev-tip-form';
import UnauthorizedRequest from '#/components/unauthorized-request';

export const metadata = {
    title: 'Create New Tip',
    description: 'Create a new tip',
};

const CreateNewTipPage = async () => {
    const session = await auth();

    if (!session) {
        return (
            <UnauthorizedRequest description="Posting a new dev tip is allowed only for logged-in users." />
        );
    }

    return (
        <div>
            SESSION
            <br />
            <pre>{JSON.stringify(session)}</pre>
            <DevTipForm mode="create" />
        </div>
    );
};

export default CreateNewTipPage;
