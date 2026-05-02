import cn from "classnames";

/**
 * One horizontal period of the sine in SVG user units.
 * Must match the `translate3d` distance in `globals.css` (`.music-playing-sine-scroll`).
 */
const PERIOD = 28;
const VIEW_H = 14;
const MID = VIEW_H / 2;

function sinePath(periods: number, amplitude: number): string {
    const totalW = PERIOD * periods;
    const segments = Math.max(32, 24 * periods);
    let d = "";
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * totalW;
        const y = MID + amplitude * Math.sin((x / PERIOD) * 2 * Math.PI);
        d += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
    }
    return d;
}

/** Two periods for seamless horizontal loop while playing */
const PATH_PLAYING = sinePath(2, 4.25);
/** Single period when paused / reduced motion */
const PATH_IDLE = sinePath(1, 3);

type Props = {
    /** When false, reserve horizontal space so list rows stay aligned */
    visible: boolean;
    animating: boolean;
    className?: string;
};

export function PlayingWave({ visible, animating, className }: Props) {
    return (
        <div
            className={cn(
                "relative h-[14px] w-7 shrink-0 overflow-hidden",
                !visible && "opacity-0",
                className,
            )}
            aria-hidden
        >
            <svg
                width={PERIOD}
                height={VIEW_H}
                className="block text-neutral-800 dark:text-slate-200"
                viewBox={`0 0 ${PERIOD} ${VIEW_H}`}
            >
                <g className={cn(animating && "music-playing-sine-scroll")}>
                    <path
                        d={animating ? PATH_PLAYING : PATH_IDLE}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </g>
            </svg>
        </div>
    );
}
