"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SiteToastContainer() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const el = document.documentElement;
        const sync = () => setTheme(el.classList.contains("dark") ? "dark" : "light");
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(el, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={4000}
            closeOnClick
            pauseOnHover
            draggable
            theme={theme}
            toastClassName="text-sm"
        />
    );
}
