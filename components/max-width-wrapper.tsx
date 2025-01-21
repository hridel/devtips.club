import React from 'react';

import { cn } from '#/lib/utils';

interface MaxWidthWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const MaxWidthWrapper = (props: MaxWidthWrapperProps) => {
    const { children, className } = props;

    return (
        <div
            className={cn('h-full mx-auto max-w-3xl px-4 md:px-20', className)}
        >
            {children}
        </div>
    );
};

export default MaxWidthWrapper;
