type Props = {
    minutes: number;
    label: string;
};

export function ReadingTime({ minutes, label }: Props) {
    return (
        <span className="text-neutral-500 dark:text-neutral-400 text-sm">
            {label.replace("{minutes}", String(minutes))}
        </span>
    );
}
