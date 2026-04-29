"use client";

import { useState, useTransition } from "react";
import { deleteComment } from "@/lib/actions/comments";
import { CommentForm } from "./comment-form";
import { Comment } from "@/lib/supabase/types";

type Props = {
    comment: Comment;
    replies: Comment[];
    postSlug: string;
    locale: string;
    currentUserId: string | null;
    isAdmin: boolean;
};

export function CommentItem({ comment, replies, postSlug, locale, currentUserId, isAdmin }: Props) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const canDelete = isAdmin || currentUserId === comment.user_id;

    function handleDelete() {
        startTransition(async () => {
            await deleteComment(comment.id, postSlug, locale);
        });
    }

    const displayName = comment.profiles?.display_name ?? "Anonymous";
    const formattedDate = new Date(comment.created_at).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
    );

    return (
        <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-sm font-semibold text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
                            {displayName[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold">{displayName}</span>
                        <span className="text-xs text-neutral-400">{formattedDate}</span>
                    </div>
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="text-xs text-neutral-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                            aria-label="Delete comment"
                        >
                            Delete
                        </button>
                    )}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                {currentUserId && (
                    <button
                        onClick={() => setShowReplyForm((v) => !v)}
                        className="mt-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                        {showReplyForm ? "Cancel" : "Reply"}
                    </button>
                )}
            </div>

            {/* Replies */}
            {replies.length > 0 && (
                <div className="ml-8 flex flex-col gap-2">
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
                        >
                            <ReplyRow
                                reply={reply}
                                locale={locale}
                                currentUserId={currentUserId}
                                isAdmin={isAdmin}
                                postSlug={postSlug}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Reply form */}
            {showReplyForm && currentUserId && (
                <div className="ml-8">
                    <CommentForm
                        postSlug={postSlug}
                        locale={locale}
                        parentId={comment.id}
                        placeholder={`Reply to ${displayName}…`}
                        onSuccess={() => setShowReplyForm(false)}
                    />
                </div>
            )}
        </div>
    );
}

function ReplyRow({
    reply,
    locale,
    currentUserId,
    isAdmin,
    postSlug,
}: {
    reply: Comment;
    locale: string;
    currentUserId: string | null;
    isAdmin: boolean;
    postSlug: string;
}) {
    const [isPending, startTransition] = useTransition();
    const canDelete = isAdmin || currentUserId === reply.user_id;
    const displayName = reply.profiles?.display_name ?? "Anonymous";
    const formattedDate = new Date(reply.created_at).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
    );

    return (
        <>
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-xs font-semibold text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
                        {displayName[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">{displayName}</span>
                    <span className="text-xs text-neutral-400">{formattedDate}</span>
                </div>
                {canDelete && (
                    <button
                        onClick={() => startTransition(async () => { await deleteComment(reply.id, postSlug, locale); })}
                        disabled={isPending}
                        className="text-xs text-neutral-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                        aria-label="Delete reply"
                    >
                        Delete
                    </button>
                )}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
        </>
    );
}
