import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import type { NextAuthOptions, Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { prisma } from '#/lib/db';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authConfig = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        async signIn({ user, profile }) {
            let userId: number;

            const existingUser = await prisma.user.findUnique({
                where: { email: `${user.email?.toLowerCase()}` },
            });

            if (!existingUser) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const newUserName = user.name || profile?.login || 'anonymous';
                const createResponse = await prisma.user.create({
                    data: {
                        email: `${user.email?.toLowerCase()}`,
                        name: newUserName,
                    },
                });
                userId = createResponse.id;
            } else {
                userId = existingUser.id;
            }

            user.id = userId.toString();

            return true; // Allow sign-in
        },

        async session({ session, token }): Promise<Session> {
            session.user = {
                ...session.user,
                id: token.sub?.toString() || session.user.id || '0',
            };

            return session;
        },
    },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authConfig);
}
