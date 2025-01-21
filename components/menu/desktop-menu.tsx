import Link from 'next/link';

import { MenuItems } from '#/components/menu/def';
import { Separator } from '#/components/ui/separator';

const DesktopMenu = () => {
    return (
        <nav className="hidden md:flex items-center">
            <ul className="flex items-center justify-end gap-3">
                {MenuItems.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                    </li>
                ))}
            </ul>
            <Separator orientation="vertical" className="mx-3 h-4" />
            <ul className="flex items-center justify-end gap-3">
                <li>
                    <Link href="/my-tips">My Tips</Link>
                </li>
            </ul>
        </nav>
    );
};

export default DesktopMenu;
