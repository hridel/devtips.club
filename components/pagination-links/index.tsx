'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ReactElement } from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '#/components/ui/pagination';

export interface PaginationLinksProps {
    totalPages: number;
}

const PaginationLinks = (props: PaginationLinksProps): ReactElement => {
    const { totalPages } = props;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const renderPageLinks = () => {
        const pageLinks = [];

        // Previous page
        if (currentPage > 1) {
            pageLinks.push(
                <PaginationItem key="prev">
                    <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        className="flex md:hidden"
                    />
                </PaginationItem>
            );
        }

        // First 2 pages
        for (let i = 1; i <= Math.min(2, totalPages); i++) {
            pageLinks.push(
                <PaginationItem key={i} className="hidden md:block">
                    <PaginationLink
                        href={createPageURL(i)}
                        className={currentPage === i ? 'font-bold' : ''}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Ellipsis if needed before the current page range
        if (currentPage > 4 && totalPages > 4) {
            pageLinks.push(
                <PaginationItem key="ellipsis1" className="hidden md:block">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Pages around current page (-2 to +2)
        for (
            let i = Math.max(3, currentPage - 2);
            i <= Math.min(totalPages - 2, currentPage + 2);
            i++
        ) {
            pageLinks.push(
                <PaginationItem key={i} className="hidden md:block">
                    <PaginationLink
                        href={createPageURL(i)}
                        className={currentPage === i ? 'font-bold' : ''}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Ellipsis if needed after current page range
        if (currentPage < totalPages - 3 && totalPages > 4) {
            pageLinks.push(
                <PaginationItem key="ellipsis2" className="hidden md:block">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Last 2 pages
        for (let i = Math.max(totalPages - 1, 3); i <= totalPages; i++) {
            pageLinks.push(
                <PaginationItem key={i} className="hidden md:block">
                    <PaginationLink
                        href={createPageURL(i)}
                        className={currentPage === i ? 'font-bold' : ''}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Next page
        if (currentPage < totalPages) {
            pageLinks.push(
                <PaginationItem key="next">
                    <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        className="flex md:hidden"
                    />
                </PaginationItem>
            );
        }

        return pageLinks;
    };

    return (
        <Pagination>
            <PaginationContent>{renderPageLinks()}</PaginationContent>
        </Pagination>
    );
};

export default PaginationLinks;
