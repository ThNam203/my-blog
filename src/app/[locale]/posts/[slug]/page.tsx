import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { CommentSection } from "@/app/_components/comments/comment-section";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
type Params = {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
};

export default async function Post(props: Params) {
    const params = await props.params;
    if (!isValidLocale(params.locale)) {
        return notFound();
    }

    const post = getPostBySlug(params.slug, params.locale);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || "");

    return (
        <main>
            <Container>
                <article className="mb-32">
                    <PostHeader
                        title={post.title}
                        categories={post.categories}
                        coverImage={post.coverImage}
                        date={post.date}
                        author={post.author}
                        locale={params.locale}
                    />
                    <PostBody content={content} />
                </article>
                <CommentSection postSlug={params.slug} locale={params.locale} />
            </Container>
        </main>
    );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    if (!isValidLocale(params.locale)) {
        return {};
    }

    const post = getPostBySlug(params.slug, params.locale);
    if (!post) {
        return notFound();
    }

    const dictionary = getDictionary(params.locale);
    const title = `${post.title} | ${dictionary.metadata.siteName}`;
    const ogImageUrl = post.ogImage?.url ?? post.coverImage;

    return {
        title,
        openGraph: {
            title,
            ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
        },
    };
}

export async function generateStaticParams() {
    const viPosts = getAllPosts("vi");
    const enPosts = getAllPosts("en");

    return [
        ...viPosts.map((post) => ({
            locale: "vi",
            slug: post.slug,
        })),
        ...enPosts.map((post) => ({
            locale: "en",
            slug: post.slug,
        })),
    ];
}
