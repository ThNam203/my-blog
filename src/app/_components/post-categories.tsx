import { type Locale } from "@/i18n/config";
import Link from "next/link";

function slugifyCategory(category: string): string {
    return category.toLowerCase().replace(/\s+/g, "-");
}

type Props = {
    categories: string[];
    locale: Locale;
};

export function PostCategories({ categories, locale }: Props) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
                <Link
                    key={category}
                    href={`/${locale}/categories/${slugifyCategory(category)}`}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs uppercase tracking-wide text-neutral-700 hover:border-neutral-500 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-100 transition-colors"
                >
                    {category}
                </Link>
            ))}
        </div>
    );
}
