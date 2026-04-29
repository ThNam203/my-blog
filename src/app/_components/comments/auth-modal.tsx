"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/auth";

type Tab = "login" | "register";

type Props = {
    onClose: () => void;
};

export function AuthModal({ onClose }: Props) {
    const [tab, setTab] = useState<Tab>("login");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const dialogRef = useRef<HTMLDivElement>(null);

    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) onClose();
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        startTransition(async () => {
            if (tab === "login") {
                const result = await signIn(email, password);
                if (result.error) {
                    setError(result.error);
                } else {
                    router.refresh();
                    onClose();
                }
            } else {
                const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
                const result = await signUp(displayName, email, password);
                if (result.error) {
                    setError(result.error);
                } else {
                    setError("");
                    // Show success state — Supabase sends a confirmation email by default
                    // (can be disabled in Supabase dashboard → Auth → Settings)
                    setTab("login");
                    setError("Account created! Check your email to confirm, then log in.");
                }
            }
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div
                ref={dialogRef}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-neutral-900"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button
                            onClick={() => { setTab("login"); setError(""); }}
                            className={`text-lg font-semibold transition-colors ${tab === "login" ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setTab("register"); setError(""); }}
                            className={`text-lg font-semibold transition-colors ${tab === "register" ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`}
                        >
                            Register
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {tab === "register" && (
                        <input
                            name="displayName"
                            type="text"
                            placeholder="Display name"
                            required
                            minLength={2}
                            maxLength={50}
                            className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        minLength={6}
                        className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />

                    {error && (
                        <p className={`text-sm ${error.startsWith("Account created") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                    >
                        {isPending ? "..." : tab === "login" ? "Login" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
