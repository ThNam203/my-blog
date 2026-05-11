import { createClient } from "@/lib/supabase/server";
import { getComments } from "@/lib/actions/comments";
import { getAuthModalLabels, getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, type Locale } from "@/i18n/config";
import { CommentList } from "./comment-list";

type Props = {
    postSlug: string;
    locale: string;
};

export async function CommentSection({ postSlug, locale }: Props) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const comments = await getComments(postSlug);
    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    const dictionary = isValidLocale(locale)
        ? getDictionary(locale as Locale)
        : getDictionary("en");

    let currentDisplayName: string | null = null;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .maybeSingle();
        currentDisplayName = profile?.display_name ?? null;
    }

    return (
        <CommentList
            comments={comments}
            postSlug={postSlug}
            locale={locale}
            currentUserId={user?.id ?? null}
            currentUserEmail={user?.email ?? null}
            currentUserDisplayName={currentDisplayName}
            adminEmail={adminEmail}
            signInToCommentLabel={dictionary.ui.commentsSignInToComment}
            commentsTitle={dictionary.ui.commentsTitle}
            commentsEmpty={dictionary.ui.commentsEmpty}
            commentsWritePlaceholder={dictionary.ui.commentsWritePlaceholder}
            commentsReplyPlaceholder={dictionary.ui.commentsReplyPlaceholder}
            commentsPost={dictionary.ui.commentsPost}
            commentsPosting={dictionary.ui.commentsPosting}
            commentsPostedSuccess={dictionary.ui.commentsPostedSuccess}
            commentsCancel={dictionary.ui.commentsCancel}
            authModal={getAuthModalLabels(dictionary)}
            commentsAnonymous={dictionary.ui.commentsAnonymous}
            commentsReply={dictionary.ui.commentsReply}
            commentsDelete={dictionary.ui.commentsDelete}
            commentsDeleteCommentAria={dictionary.ui.commentsDeleteCommentAria}
            commentsDeleteReplyAria={dictionary.ui.commentsDeleteReplyAria}
        />
    );
}
