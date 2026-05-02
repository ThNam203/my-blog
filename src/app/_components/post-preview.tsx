import { type Author } from "@/interfaces/author";
import { type Locale } from "@/i18n/config";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostCategories } from "./post-categories";

type Props = {
    title: string;
    categories: string[];
    coverImage?: string;
    date: string;
    excerpt: string;
    author: Author;
    slug: string;
    locale: Locale;
};

export function PostPreview({
    title,
    categories,
    coverImage,
    date,
    excerpt,
    author,
    slug,
    locale,
}: Props) {
    return (
        <div>
            {coverImage ? (
                <div className="mb-5">
                    <CoverImage slug={slug} title={title} src={coverImage} locale={locale} />
                </div>
            ) : null}
            <PostCategories categories={categories} locale={locale} />
            <h3 className="text-3xl mb-3 leading-snug">
                <Link href={`/${locale}/posts/${slug}`} className="hover:underline">
                    {title}
                </Link>
            </h3>
            <div className="text-lg mb-4">
                <DateFormatter dateString={date} locale={locale} />
            </div>
            <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
            <Avatar name={author.name} picture={author.picture} />
        </div>
    );
}
