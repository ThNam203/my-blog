import { createClient } from "@/lib/supabase/server";
import { getComments } from "@/lib/actions/comments";
import { CommentList } from "./comment-list";

type Props = {
    postSlug: string;
    locale: string;
};

export async function CommentSection({ postSlug, locale }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const comments = await getComments(postSlug);
    const adminEmail = process.env.ADMIN_EMAIL ?? "";

    return (
        <CommentList
            comments={comments}
            postSlug={postSlug}
            locale={locale}
            currentUserId={user?.id ?? null}
            currentUserEmail={user?.email ?? null}
            adminEmail={adminEmail}
        />
    );
}
