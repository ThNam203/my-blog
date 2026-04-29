import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/app/_components/footer";
import { ThemeSwitcher } from "@/app/_components/theme-switcher";
import { LocaleSwitcher } from "@/app/_components/locale-switcher";
import { WEB_DEFAULT_INSTAGRAM_URL, WEB_DEFAULT_URL } from "@/lib/constants";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, type Locale } from "@/i18n/config";

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
            <div className="min-h-screen">{children}</div>
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
