import { cn } from '#/lib/utils';

interface TipScoreProps {
    score: number;
    tipId: string;
    className?: string;
}

const TipScore = (props: TipScoreProps) => {
    const { score, className } = props;
    const [integerPart, decimalPart] = score.toFixed(3).split('.');

    return (
        <div
            className={cn(
                ' w-16 h-16  flex flex-col items-center, justify-center',
                className
            )}
        >
            <p className="text-center bg-gradient-to-r from-blue-700/100 to-blue-700/50 bg-clip-text text-transparent">
                <span className="text-3xl font-bold">{integerPart}.</span>
                {decimalPart.split('').map((digit, index) => (
                    <span
                        key={index}
                        className={
                            index === 0
                                ? 'font-bold'
                                : index === 1
                                  ? 'font-bold text-sm'
                                  : 'font-bold text-xs'
                        }
                    >
                        {digit}
                    </span>
                ))}
            </p>
        </div>
    );
};

export default TipScore;
