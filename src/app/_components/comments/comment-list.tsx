"use client";

import { useState } from "react";
import { Comment } from "@/lib/supabase/types";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { AuthModal } from "./auth-modal";
import { signOut } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

type Props = {
    comments: Comment[];
    postSlug: string;
    locale: string;
    currentUserId: string | null;
    currentUserEmail: string | null;
    adminEmail: string;
};

export function CommentList({ comments, postSlug, locale, currentUserId, currentUserEmail, adminEmail }: Props) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();

    const isAdmin = currentUserEmail === adminEmail;
    const topLevel = comments.filter((c) => !c.parent_id);
    const replies = comments.filter((c) => !!c.parent_id);

    async function handleSignOut() {
        await signOut();
        router.refresh();
    }

    return (
        <div className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-700">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">
                Comments ({comments.length})
            </h2>

            {/* Auth bar */}
            <div className="mb-8">
                {currentUserId ? (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">
                            Commenting as <span className="font-medium text-neutral-800 dark:text-neutral-200">{currentUserEmail}</span>
                        </span>
                        <button
                            onClick={handleSignOut}
                            className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-500">
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="font-medium text-neutral-800 underline underline-offset-2 hover:no-underline dark:text-neutral-200"
                            >
                                Login or register
                            </button>{" "}
                            to leave a comment.
                        </span>
                    </div>
                )}
            </div>

            {/* New top-level comment form */}
            {currentUserId && (
                <div className="mb-10">
                    <CommentForm postSlug={postSlug} locale={locale} />
                </div>
            )}

            {/* Comment thread */}
            {topLevel.length === 0 ? (
                <p className="text-sm text-neutral-400">No comments yet. Be the first!</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {topLevel.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            replies={replies.filter((r) => r.parent_id === comment.id)}
                            postSlug={postSlug}
                            locale={locale}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
}
