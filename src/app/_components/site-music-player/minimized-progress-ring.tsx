type Props = {
    progress: number;
    gradientId: string;
};

export function MinimizedProgressRing({ progress, gradientId }: Props) {
    const size = 56;
    const stroke = 3;
    const cx = size / 2;
    const cy = size / 2;
    const r = cx - stroke / 2 - 0.5;
    const circumference = 2 * Math.PI * r;
    const clamped = Math.min(1, Math.max(0, progress));
    const dashOffset = circumference * (1 - clamped);

    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="55%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
            </defs>
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                className="text-neutral-200/90 dark:text-slate-600"
                stroke="currentColor"
                strokeWidth={stroke}
            />
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
            />
        </svg>
    );
}
