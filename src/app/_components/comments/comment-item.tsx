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
    replyPlaceholderTemplate: string;
    postLabel: string;
    postingLabel: string;
    postedSuccessLabel: string;
    cancelLabel: string;
    anonymousLabel: string;
    replyLabel: string;
    deleteLabel: string;
    deleteCommentAria: string;
    deleteReplyAria: string;
};

export function CommentItem({
    comment,
    replies,
    postSlug,
    locale,
    currentUserId,
    isAdmin,
    replyPlaceholderTemplate,
    postLabel,
    postingLabel,
    postedSuccessLabel,
    cancelLabel,
    anonymousLabel,
    replyLabel,
    deleteLabel,
    deleteCommentAria,
    deleteReplyAria,
}: Props) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const canDelete = isAdmin || currentUserId === comment.user_id;

    function handleDelete() {
        startTransition(async () => {
            await deleteComment(comment.id, postSlug, locale);
        });
    }

    const displayName = comment.profiles?.display_name ?? anonymousLabel;
    const initial = (displayName[0] ?? "?").toUpperCase();
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
                            {initial}
                        </div>
                        <span className="text-sm font-semibold">{displayName}</span>
                        <span className="text-xs text-neutral-400">{formattedDate}</span>
                    </div>
                    {canDelete && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="text-xs text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-50"
                            aria-label={deleteCommentAria}
                        >
                            {deleteLabel}
                        </button>
                    )}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.body}</p>
                {currentUserId && (
                    <button
                        type="button"
                        onClick={() => setShowReplyForm((v) => !v)}
                        className="mt-2 text-xs text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                        {showReplyForm ? cancelLabel : replyLabel}
                    </button>
                )}
            </div>

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
                                anonymousLabel={anonymousLabel}
                                deleteLabel={deleteLabel}
                                deleteReplyAria={deleteReplyAria}
                            />
                        </div>
                    ))}
                </div>
            )}

            {showReplyForm && currentUserId && (
                <div className="ml-8">
                    <CommentForm
                        postSlug={postSlug}
                        locale={locale}
                        parentId={comment.id}
                        placeholder={replyPlaceholderTemplate.replaceAll("{name}", displayName)}
                        postLabel={postLabel}
                        postingLabel={postingLabel}
                        postedSuccessLabel={postedSuccessLabel}
                        cancelLabel={cancelLabel}
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
    anonymousLabel,
    deleteLabel,
    deleteReplyAria,
}: {
    reply: Comment;
    locale: string;
    currentUserId: string | null;
    isAdmin: boolean;
    postSlug: string;
    anonymousLabel: string;
    deleteLabel: string;
    deleteReplyAria: string;
}) {
    const [isPending, startTransition] = useTransition();
    const canDelete = isAdmin || currentUserId === reply.user_id;
    const displayName = reply.profiles?.display_name ?? anonymousLabel;
    const initial = (displayName[0] ?? "?").toUpperCase();
    const formattedDate = new Date(reply.created_at).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
    );

    return (
        <>
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-xs font-semibold text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
                        {initial}
                    </div>
                    <span className="text-sm font-semibold">{displayName}</span>
                    <span className="text-xs text-neutral-400">{formattedDate}</span>
                </div>
                {canDelete && (
                    <button
                        type="button"
                        onClick={() =>
                            startTransition(async () => {
                                await deleteComment(reply.id, postSlug, locale);
                            })
                        }
                        disabled={isPending}
                        className="text-xs text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-50"
                        aria-label={deleteReplyAria}
                    >
                        {deleteLabel}
                    </button>
                )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{reply.body}</p>
        </>
    );
}
