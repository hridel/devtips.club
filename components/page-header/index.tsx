import MaxWidthWrapper from '#/components/max-width-wrapper';
import Menu from '#/components/menu';

const PageHeader = () => {
    return (
        <header className="fixed top-0 left-0 w-full h-12 z-50 bg-white/80 backdrop-blur-md backdrop-saturate-150 border-b border-b-blue-300">
            <MaxWidthWrapper className="flex items-center justify-between">
                <h1 className="font-bold">DevTips CLUB</h1>
                <Menu />
            </MaxWidthWrapper>
        </header>
    );
};

export default PageHeader;
