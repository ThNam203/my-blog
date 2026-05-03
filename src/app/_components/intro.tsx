import Link from "next/link";

type Props = {
    heading: string;
    homeHref: string;
};

export function Intro({ heading, homeHref }: Props) {
    return (
        <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
                <Link
                    href={homeHref}
                    className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground rounded-sm"
                >
                    {heading}
                </Link>
            </h1>
        </section>
    );
}
