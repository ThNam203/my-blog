"use client";

import { useEffect, useRef, useState } from "react";

declare global {
    var updateDOM: () => void;
}

type ColorSchemePreference = "system" | "dark" | "light";

const STORAGE_KEY = "nam-blog-theme";
const modes: ColorSchemePreference[] = ["dark", "light", "system"];
type ThemeLabelMap = Record<ColorSchemePreference, string>;
const defaultModeLabels: ThemeLabelMap = {
    dark: "Dark",
    light: "Light",
    system: "System",
};

/** to reuse updateDOM function defined inside injected script */

/** function to be injected in script tag for avoiding FOUC (Flash of Unstyled Content) */
export const NoFOUCScript = (storageKey: string) => {
    /* can not use outside constants or function as this script will be injected in a different context */
    const [SYSTEM, DARK, LIGHT] = ["system", "dark", "light"];

    /** Modify transition globally to avoid patched transitions */
    const modifyTransition = () => {
        const css = document.createElement("style");
        css.textContent = "*,*:after,*:before{transition:none !important;}";
        document.head.appendChild(css);

        return () => {
            /* Force restyle */
            getComputedStyle(document.body);
            /* Wait for next tick before removing */
            setTimeout(() => document.head.removeChild(css), 1);
        };
    };

    const media = matchMedia(`(prefers-color-scheme: ${DARK})`);

    /** function to add remove dark class */
    window.updateDOM = () => {
        const restoreTransitions = modifyTransition();
        const mode = localStorage.getItem(storageKey) ?? SYSTEM;
        const systemMode = media.matches ? DARK : LIGHT;
        const resolvedMode = mode === SYSTEM ? systemMode : mode;
        const classList = document.documentElement.classList;
        if (resolvedMode === DARK) classList.add(DARK);
        else classList.remove(DARK);
        document.documentElement.setAttribute("data-mode", mode);
        restoreTransitions();
    };
    window.updateDOM();
    media.addEventListener("change", window.updateDOM);
};

let updateDOM: () => void;

/**
 * Switch button to quickly toggle user preference.
 */
const Switch = ({ labels }: { labels: ThemeLabelMap }) => {
    const [mode, setMode] = useState<ColorSchemePreference>("system");
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // store global functions to local variables to avoid any interference
        updateDOM = window.updateDOM;
        const storedMode = localStorage.getItem(STORAGE_KEY);
        if (storedMode === "dark" || storedMode === "light" || storedMode === "system") {
            setMode(storedMode);
        }
        setIsMounted(true);

        /** Sync the tabs */
        const handleStorage = (e: StorageEvent): void => {
            if (e.key !== STORAGE_KEY) {
                return;
            }

            if (e.newValue === "dark" || e.newValue === "light" || e.newValue === "system") {
                setMode(e.newValue);
                return;
            }

            setMode("system");
        };

        const handleClickOutside = (event: MouseEvent): void => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        addEventListener("storage", handleStorage);
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            removeEventListener("storage", handleStorage);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
        if (updateDOM) {
            updateDOM();
        }
    }, [mode]);

    const handleModeSelect = (nextMode: ColorSchemePreference) => {
        setMode(nextMode);
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="absolute right-5 top-[70px] z-50">
            <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-semibold
                tracking-wide transition-colors hover:bg-neutral-100 dark:border-slate-600
                dark:bg-slate-900 dark:hover:bg-slate-800"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isMounted ? labels[mode] : labels.system}
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 min-w-28 rounded-md border border-neutral-300
                    bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-900"
                >
                    {modes.map((themeMode) => (
                        <button
                            key={themeMode}
                            type="button"
                            className="block w-full rounded px-3 py-1 text-left text-sm capitalize
                            hover:bg-neutral-100 dark:hover:bg-slate-800"
                            onClick={() => handleModeSelect(themeMode)}
                        >
                            {labels[themeMode]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

type Props = {
    labels?: Partial<ThemeLabelMap>;
};

/**
 * This component applies classes and transitions.
 */
export const ThemeSwitcher = ({ labels }: Props) => {
    const resolvedLabels: ThemeLabelMap = {
        ...defaultModeLabels,
        ...labels,
    };

    return (
        <>
            <Switch labels={resolvedLabels} />
        </>
    );
};
