import Link from "next/link";
import DateFormatter from "./date-formatter";
import { type Locale } from "@/i18n/config";
import { type Post } from "@/interfaces/post";

type Props = {
    posts: Post[];
    locale: Locale;
    heading: string;
};

export function RelatedPosts({ posts, locale, heading }: Props) {
    if (posts.length === 0) return null;

    return (
        <section className="mt-16 max-w-2xl mx-auto border-t border-neutral-200 pt-10 dark:border-neutral-700">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">{heading}</h2>
            <ul className="flex flex-col gap-4">
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link
                            href={`/${locale}/posts/${post.slug}`}
                            className="group block rounded-lg p-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <div className="text-lg font-semibold group-hover:underline">
                                {post.title}
                            </div>
                            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                <DateFormatter dateString={post.date} locale={locale} />
                            </div>
                            {post.excerpt && (
                                <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                                    {post.excerpt}
                                </p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
