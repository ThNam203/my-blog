import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";
import { type Locale } from "@/i18n/config";
import { PostCategories } from "./post-categories";

type Props = {
    title: string;
    categories: string[];
    coverImage?: string;
    date: string;
    author: Author;
    locale: Locale;
};

export function PostHeader({ title, categories, coverImage, date, author, locale }: Props) {
    return (
        <>
            <PostTitle>{title}</PostTitle>
            <div className="hidden md:block md:mb-12">
                <Avatar name={author.name} picture={author.picture} />
            </div>
            {coverImage ? (
                <div className="mb-8 md:mb-16 sm:mx-0">
                    <CoverImage title={title} src={coverImage} />
                </div>
            ) : null}
            <div className="max-w-2xl mx-auto">
                <div className="block md:hidden mb-6">
                    <Avatar name={author.name} picture={author.picture} />
                </div>
                <PostCategories categories={categories} locale={locale} />
                <div className="mb-6 text-lg">
                    <DateFormatter dateString={date} locale={locale} />
                </div>
            </div>
        </>
    );
}
