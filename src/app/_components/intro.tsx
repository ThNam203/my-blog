import Link from "next/link";

type Props = {
    heading: string;
    homeHref: string;
    secondaryNav?: { href: string; label: string };
};

export function Intro({ heading, homeHref, secondaryNav }: Props) {
    return (
        <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
            <div className="md:pr-8">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight">
                    <Link
                        href={homeHref}
                        className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground rounded-sm"
                    >
                        {heading}
                    </Link>
                </h1>
                {secondaryNav && (
                    <nav className="mt-4" aria-label="Site sections">
                        <Link
                            href={secondaryNav.href}
                            className="text-base font-medium text-black underline-offset-4 hover:underline dark:text-white dark:hover:text-white md:text-lg"
                        >
                            {secondaryNav.label}
                        </Link>
                    </nav>
                )}
            </div>
        </section>
    );
}
