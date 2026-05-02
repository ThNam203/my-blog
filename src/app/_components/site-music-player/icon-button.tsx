import cn from "classnames";
import type { ReactNode } from "react";

type Props = {
    label: string;
    onClick: () => void;
    children: ReactNode;
    ariaExpanded?: boolean;
};

export function IconButton({ label, onClick, children, ariaExpanded }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-expanded={ariaExpanded}
            className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-colors",
                "hover:bg-neutral-200 dark:text-slate-100 dark:hover:bg-slate-800",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
                "dark:focus-visible:outline-white",
            )}
        >
            {children}
        </button>
    );
}
