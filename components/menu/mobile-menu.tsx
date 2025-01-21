'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { MenuItems } from '#/components/menu/def';
import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '#/components/ui/sheet';

const MobileMenu = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="block md:hidden">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>DevTips club menu</SheetTitle>
                </SheetHeader>
                <nav className="py-4">
                    <ul>
                        {MenuItems.map((item) => (
                            <li className="mb-2" key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Separator />
                <nav className="py-4">
                    <ul>
                        <li>
                            <Link
                                href="/my-tips"
                                onClick={() => setOpen(false)}
                            >
                                My tips
                            </Link>
                        </li>
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
