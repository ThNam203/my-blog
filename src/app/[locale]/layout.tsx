import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@/app/_components/alert";
import Footer from "@/app/_components/footer";
import { ThemeSwitcher } from "@/app/_components/theme-switcher";
import { LocaleSwitcher } from "@/app/_components/locale-switcher";
import { WEB_DEFAULT_INSTAGRAM_URL, WEB_DEFAULT_URL } from "@/lib/constants";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, type Locale } from "@/i18n/config";
import { Intro } from "../_components/intro";

type Props = {
    children: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) {
        return {};
    }

    const dictionary = getDictionary(locale);

    return {
        title: dictionary.metadata.title,
        description: dictionary.metadata.description,
        openGraph: {
            title: dictionary.metadata.title,
            description: dictionary.metadata.description,
            images: [],
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) {
        notFound();
    }

    const dictionary = getDictionary(locale as Locale);

    return (
        <>
            <Alert
                textPrefix={dictionary.ui.alertTextPrefix}
                linkLabel={dictionary.ui.alertLinkLabel}
                websiteUrl={WEB_DEFAULT_URL}
            />
            <header className="container mx-auto flex items-center justify-between">
                <Intro heading={dictionary.ui.blogHeading} />
                <div className="flex items-center gap-2">
                <ThemeSwitcher
                    labels={{
                        dark: dictionary.ui.themeDark,
                        light: dictionary.ui.themeLight,
                        system: dictionary.ui.themeSystem,
                    }}
                />
                <LocaleSwitcher
                    locale={locale}
                    vietnameseLabel={dictionary.ui.languageOptionVietnamese}
                    englishLabel={dictionary.ui.languageOptionEnglish}
                />
                </div>
            </header>
            <main>{children}</main>
            <Footer
                description={dictionary.metadata.description}
                websiteUrl={WEB_DEFAULT_URL}
                instagramUrl={WEB_DEFAULT_INSTAGRAM_URL}
                primaryCta={dictionary.ui.footerPrimaryCta}
                secondaryCta={dictionary.ui.footerSecondaryCta}
            />
        </>
    );
}
