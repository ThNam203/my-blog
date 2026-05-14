import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";

type Props = {
    title: string;
    src: string;
    slug?: string;
    locale?: Locale;
    preload?: boolean;
};

const CoverImage = ({ title, src, slug, locale, preload = false }: Props) => {
    const image = (
        <Image
            src={src}
            alt={`Cover Image for ${title}`}
            className={cn("shadow-sm w-full max-h-[400px] aspect-video", {
                "hover:shadow-lg transition-shadow duration-200": slug,
            })}
            width={1300}
            height={630}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1300px"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            quality={75}
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
