"use client";

import { useState } from "react";
import { Comment } from "@/lib/supabase/types";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { AuthModal } from "./auth-modal";
import type { AuthModalLabels } from "@/i18n/dictionaries";

type Props = {
    comments: Comment[];
    postSlug: string;
    locale: string;
    currentUserId: string | null;
    currentUserEmail: string | null;
    adminEmail: string;
    signInToCommentLabel: string;
    commentsTitle: string;
    commentsEmpty: string;
    commentsWritePlaceholder: string;
    commentsReplyPlaceholder: string;
    commentsPost: string;
    commentsPosting: string;
    commentsPostedSuccess: string;
    commentsCancel: string;
    authModal: AuthModalLabels;
    commentsAnonymous: string;
    commentsReply: string;
    commentsDelete: string;
    commentsDeleteCommentAria: string;
    commentsDeleteReplyAria: string;
};

export function CommentList({
    comments,
    postSlug,
    locale,
    currentUserId,
    currentUserEmail,
    adminEmail,
    signInToCommentLabel,
    commentsTitle,
    commentsEmpty,
    commentsWritePlaceholder,
    commentsReplyPlaceholder,
    commentsPost,
    commentsPosting,
    commentsPostedSuccess,
    commentsCancel,
    authModal,
    commentsAnonymous,
    commentsReply,
    commentsDelete,
    commentsDeleteCommentAria,
    commentsDeleteReplyAria,
}: Props) {
    const [showAuthModal, setShowAuthModal] = useState(false);

    const isAdmin = currentUserEmail === adminEmail;
    const topLevel = comments.filter((c) => !c.parent_id);
    const replies = comments.filter((c) => !!c.parent_id);

    return (
        <div className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-700">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">
                {commentsTitle} ({comments.length})
            </h2>

            {!currentUserId && (
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowAuthModal(true)}
                        className="text-sm font-medium text-neutral-800 underline underline-offset-2 hover:no-underline dark:text-neutral-200"
                    >
                        {signInToCommentLabel}
                    </button>
                </div>
            )}

            {currentUserId && (
                <div className="mb-8">
                    <CommentForm
                        postSlug={postSlug}
                        locale={locale}
                        placeholder={commentsWritePlaceholder}
                        postLabel={commentsPost}
                        postingLabel={commentsPosting}
                        postedSuccessLabel={commentsPostedSuccess}
                        cancelLabel={commentsCancel}
                    />
                </div>
            )}

            {topLevel.length === 0 ? (
                <p className="text-sm text-neutral-400">{commentsEmpty}</p>
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
                            replyPlaceholderTemplate={commentsReplyPlaceholder}
                            postLabel={commentsPost}
                            postingLabel={commentsPosting}
                            postedSuccessLabel={commentsPostedSuccess}
                            cancelLabel={commentsCancel}
                            anonymousLabel={commentsAnonymous}
                            replyLabel={commentsReply}
                            deleteLabel={commentsDelete}
                            deleteCommentAria={commentsDeleteCommentAria}
                            deleteReplyAria={commentsDeleteReplyAria}
                        />
                    ))}
                </div>
            )}

            {showAuthModal && (
                <AuthModal labels={authModal} onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
}
