import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";

type Props = {
    title: string;
    src: string;
    slug?: string;
    locale?: Locale;
};

const CoverImage = ({ title, src, slug, locale }: Props) => {
    const image = (
        <Image
            src={src}
            alt={`Cover Image for ${title}`}
            className={cn("shadow-sm w-full max-h-[400px] aspect-video", {
                "hover:shadow-lg transition-shadow duration-200": slug,
            })}
            width={1300}
            height={630}
        />
    );
    return (
        <div className="sm:mx-0">
            {slug ? (
                <Link
                    href={locale ? `/${locale}/posts/${slug}` : `/posts/${slug}`}
                    aria-label={title}
                >
                    {image}
                </Link>
            ) : (
                image
            )}
        </div>
    );
};

export default CoverImage;
