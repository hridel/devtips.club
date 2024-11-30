import { auth } from '#/auth';
import DevTipForm from '#/components/dev-tip-form';
import UnauthorizedRequest from '#/components/unauthorized-request';
import { getTipById } from '#/lib/services/tip';

export const metadata = {
    title: 'Edit Dev Tip',
    description: 'Edit dev tip',
};

const EditDevTipPage = async ({ params }: { params: { id: string } }) => {
    const session = await auth();
    const allParams = await params;

    if (!session) {
        return (
            <UnauthorizedRequest description="Editing a dev tip is allowed for its logged-in author only." />
        );
    }

    const tipData = await getTipById(allParams.id);

    if (session.user.id !== tipData.author.id.toString()) {
        return (
            <UnauthorizedRequest description="Editing a dev tip is allowed for its logged-in author only." />
        );
    }

    return (
        <div>
            <DevTipForm
                mode="edit"
                originalData={{
                    id: tipData.id,
                    title: tipData.title,
                    lexicalState: tipData.lexicalState,
                    tags: tipData.tags,
                }}
            />
        </div>
    );
};

export default EditDevTipPage;
