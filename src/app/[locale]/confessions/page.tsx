import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfessionForm } from "@/app/_components/confession-form";
import Container from "@/app/_components/container";
import DateFormatter from "@/app/_components/date-formatter";
import { getConfessions } from "@/lib/actions/confessions";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, type Locale } from "@/i18n/config";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const dictionary = getDictionary(locale);
    return {
        title: `${dictionary.ui.confessionsPageMetaTitle} · ${dictionary.metadata.siteName}`,
        description: dictionary.ui.confessionsPageDescription,
    };
}

export default async function ConfessionsPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) {
        notFound();
    }

    const dictionary = getDictionary(locale as Locale);
    const confessions = await getConfessions();

    return (
        <Container>
            <div className="mx-auto max-w-2xl py-8">
                <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter leading-tight text-black dark:text-white md:text-6xl">
                            {dictionary.ui.confessionsHeading}
                        </h1>
                        <p className="mt-2 text-black dark:text-neutral-200">
                            {dictionary.ui.confessionsLead}
                        </p>
                    </div>
                    <Link
                        href={`/${locale}`}
                        className="shrink-0 text-sm text-black underline-offset-2 hover:underline dark:text-white dark:hover:text-white"
                    >
                        ← {dictionary.ui.headerTitle}
                    </Link>
                </div>

                <section className="mb-14 rounded-xl border border-neutral-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/40">
                    <h2 className="sr-only">{dictionary.ui.confessionsFormHeading}</h2>
                    <ConfessionForm
                        locale={locale}
                        placeholder={dictionary.ui.confessionsPlaceholder}
                        submitLabel={dictionary.ui.confessionsSubmit}
                        submittingLabel={dictionary.ui.confessionsSubmitting}
                        successLabel={dictionary.ui.confessionsSuccess}
                        privacyNote={dictionary.ui.confessionsPrivacy}
                    />
                </section>

                <section aria-labelledby="confessions-list-heading">
                    <h2
                        id="confessions-list-heading"
                        className="mb-4 text-lg font-semibold tracking-tight text-black dark:text-white"
                    >
                        {dictionary.ui.confessionsListHeading}
                    </h2>
                    {confessions.length === 0 ? (
                        <p className="text-black dark:text-neutral-200">
                            {dictionary.ui.confessionsEmpty}
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-6">
                            {confessions.map((c) => (
                                <li
                                    key={c.id}
                                    className="rounded-lg border border-neutral-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-950/50"
                                >
                                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-black dark:text-neutral-100">
                                        {c.body}
                                    </p>
                                    <p className="mt-3 text-xs text-black dark:text-neutral-300">
                                        <DateFormatter dateString={c.created_at} locale={locale} />
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </Container>
    );
}
