import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@/app/_components/alert";
import Footer from "@/app/_components/footer";
import { SiteMusicPlayer } from "@/app/_components/site-music-player";
import { HeaderSiteMenu } from "@/app/_components/header-site-menu";
import { LETSLIVE_URL, WEB_DEFAULT_INSTAGRAM_URL } from "@/lib/constants";
import { getAuthModalLabels, getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { MUSIC_TRACKS } from "@/lib/music-tracks";
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
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const meta = user?.user_metadata as { avatar_url?: string; picture?: string } | undefined;
    const avatarUrl =
        (typeof meta?.avatar_url === "string" && meta.avatar_url) ||
        (typeof meta?.picture === "string" && meta.picture) ||
        null;

    return (
        <>
            <Alert
                textPrefix={dictionary.ui.alertTextPrefix}
                linkLabel={dictionary.ui.alertLinkLabel}
                sideWebsiteUrl={LETSLIVE_URL}
            />
            <header className="md:container mx-auto px-4 md:px-0 flex items-center justify-between">
                <Intro
                    heading={dictionary.ui.blogHeading}
                    homeHref={`/${locale}`}
                    secondaryNav={{
                        href: `/${locale}/confessions`,
                        label: dictionary.ui.confessionsNavLabel,
                    }}
                />
                <div className="relative flex items-center gap-2">
                    <HeaderSiteMenu
                        locale={locale}
                        isAuthenticated={!!user}
                        avatarUrl={avatarUrl}
                        vietnameseLabel={dictionary.ui.languageOptionVietnamese}
                        englishLabel={dictionary.ui.languageOptionEnglish}
                        languageSectionLabel={dictionary.ui.languageLabel}
                        themeLabels={{
                            dark: dictionary.ui.themeDark,
                            light: dictionary.ui.themeLight,
                            system: dictionary.ui.themeSystem,
                        }}
                        labels={{
                            menuOpenAria: dictionary.ui.headerMenuOpenAria,
                            themeSection: dictionary.ui.headerMenuTheme,
                            signIn: dictionary.ui.headerMenuSignIn,
                            signUp: dictionary.ui.headerMenuSignUp,
                            signOut: dictionary.ui.headerMenuSignOut,
                            profile: dictionary.ui.headerMenuProfile,
                        }}
                        authModal={getAuthModalLabels(dictionary)}
                    />
                </div>
            </header>
            <main id="site-main" className="pb-8 px-4 md:px-0">
                {children}
            </main>
            {MUSIC_TRACKS.length > 0 && (
                <SiteMusicPlayer
                    tracks={MUSIC_TRACKS}
                    labels={{
                        play: dictionary.ui.musicPlay,
                        pause: dictionary.ui.musicPause,
                        expand: dictionary.ui.musicExpand,
                        collapse: dictionary.ui.musicCollapse,
                        previous: dictionary.ui.musicPrevious,
                        next: dictionary.ui.musicNext,
                        minimize: dictionary.ui.musicMinimize,
                        restore: dictionary.ui.musicRestore,
                        showPlaylist: dictionary.ui.musicShowPlaylist,
                        playlistHeading: dictionary.ui.musicPlaylistHeading,
                        nowPlaying: dictionary.ui.musicNowPlaying,
                    }}
                />
            )}
            <Footer
                description={dictionary.metadata.description}
                sideWebsiteUrl={LETSLIVE_URL}
                instagramUrl={WEB_DEFAULT_INSTAGRAM_URL}
                primaryCta={dictionary.ui.footerPrimaryCta}
                secondaryCta={dictionary.ui.footerSecondaryCta}
                locale={locale as Locale}
                quotes={dictionary.ui.footerQuotes}
                quotePrevAria={dictionary.ui.footerQuotePrevAria}
                quoteNextAria={dictionary.ui.footerQuoteNextAria}
            />
        </>
    );
}
