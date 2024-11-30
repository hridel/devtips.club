import NextAuth from 'next-auth';

import { authConfig } from '#/auth';

const handler = NextAuth(authConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
export { handler as GET, handler as POST };
