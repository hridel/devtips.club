import SignInButton from '#/components/sign-in-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';

export interface UnauthorizedActionProps {
    description: string;
}

const UnauthorizedRequest = (props: UnauthorizedActionProps) => {
    const { description } = props;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Unauthorized Action</CardTitle>
                <CardDescription>
                    You are not authorized to perform this action.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {description && <p>{description}</p>}
                <SignInButton />
            </CardContent>
        </Card>
    );
};

export default UnauthorizedRequest;
