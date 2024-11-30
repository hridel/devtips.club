import type { Metadata } from 'next';
import localFont from 'next/font/local';
import React from 'react';

import Providers from '#/app/providers';
import { auth } from '#/auth';
import { Toaster } from '#/components/ui/toaster';

import './globals.css';
import './rich-text.css';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Dev Tips Club',
    description: 'Speed up your development workflow with Dev Tips Club',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers session={session}>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
