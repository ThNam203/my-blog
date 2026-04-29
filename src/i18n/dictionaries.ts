import { type Locale } from "./config";

type Dictionary = {
    metadata: {
        title: string;
        description: string;
        siteName: string;
    };
    ui: {
        headerTitle: string;
        blogHeading: string;
        moreStories: string;
        alertTextPrefix: string;
        alertLinkLabel: string;
        postsInCategory: string;
        footerPrimaryCta: string;
        footerSecondaryCta: string;
        languageLabel: string;
        languageOptionVietnamese: string;
        languageOptionEnglish: string;
        themeSystem: string;
        themeDark: string;
        themeLight: string;
    };
};

const dictionaries: Record<Locale, Dictionary> = {
    vi: {
        metadata: {
            title: "Blog của Huỳnh Thành Nam",
            description: "Đây là blog nơi mình chia sẻ suy nghĩ và trải nghiệm sống.",
            siteName: "Blog của Huỳnh Thành Nam",
        },
        ui: {
            headerTitle: "Blog",
            blogHeading: "Blog.",
            moreStories: "Bài viết khác",
            alertTextPrefix: "Đây là blog của mình. Bạn cũng có thể xem thêm",
            alertLinkLabel: "website Let's Live",
            postsInCategory: "Bài viết trong chủ đề:",
            footerPrimaryCta: "Ghé thăm website Let's Live của mình",
            footerSecondaryCta: "Theo dõi mình trên Instagram",
            languageLabel: "Ngôn ngữ",
            languageOptionVietnamese: "Tiếng Việt",
            languageOptionEnglish: "English",
            themeSystem: "Hệ thống",
            themeDark: "Tối",
            themeLight: "Sáng",
        },
    },
    en: {
        metadata: {
            title: "Blog of Huỳnh Thành Nam",
            description: "This is my blog where I share my thoughts and life experiences.",
            siteName: "Blog of Huỳnh Thành Nam",
        },
        ui: {
            headerTitle: "Blog",
            blogHeading: "Blog.",
            moreStories: "More Stories",
            alertTextPrefix: "This is my blog. You can also check out my",
            alertLinkLabel: "Let's Live website",
            postsInCategory: "Posts in:",
            footerPrimaryCta: "Visit my Let's Live website",
            footerSecondaryCta: "Follow me on Instagram",
            languageLabel: "Language",
            languageOptionVietnamese: "Tiếng Việt",
            languageOptionEnglish: "English",
            themeSystem: "System",
            themeDark: "Dark",
            themeLight: "Light",
        },
    },
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale];
}
