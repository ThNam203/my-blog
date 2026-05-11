import { renderCommentMarkdown } from "@/lib/comment-markdown";

type Props = {
    body: string;
    className?: string;
};

export function CommentBody({ body, className }: Props) {
    const html = renderCommentMarkdown(body);
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
