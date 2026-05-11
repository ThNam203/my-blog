import Container from "@/app/_components/container";
import { FooterQuotes } from "@/app/_components/footer-quotes";
import { NewsletterForm } from "@/app/_components/newsletter-form";
import type { FooterQuote } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type Props = {
    description: string;
    sideWebsiteUrl: string;
    instagramUrl: string;
    primaryCta: string;
    secondaryCta: string;
    locale: Locale;
    quotes: FooterQuote[];
    quotePrevAria: string;
    quoteNextAria: string;
    newsletter: {
        heading: string;
        description: string;
        placeholder: string;
        submit: string;
        submitting: string;
        success: string;
        genericError: string;
    };
};

export function Footer({
    description,
    sideWebsiteUrl,
    instagramUrl,
    primaryCta,
    secondaryCta,
    locale,
    quotes,
    quotePrevAria,
    quoteNextAria,
    newsletter,
}: Props) {
    const quoteStorageKey = `my-blog:footerQuoteIndex:${locale}`;

    return (
        <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800">
            <Container>
                <FooterQuotes
                    quotes={quotes}
                    storageKey={quoteStorageKey}
                    prevAria={quotePrevAria}
                    nextAria={quoteNextAria}
                />
                <div className="pt-12 px-4 md:px-0 max-w-2xl mx-auto">
                    <NewsletterForm
                        locale={locale}
                        heading={newsletter.heading}
                        description={newsletter.description}
                        placeholder={newsletter.placeholder}
                        submitLabel={newsletter.submit}
                        submittingLabel={newsletter.submitting}
                        successLabel={newsletter.success}
                        genericErrorLabel={newsletter.genericError}
                    />
                </div>
                <div className="py-28 flex flex-col lg:flex-row items-center">
                    <h3
                        className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center
                        lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2"
                    >
                        {description}
                    </h3>
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
                        <a
                            href={sideWebsiteUrl}
                            className="mx-3 bg-black hover:bg-white hover:text-black border border-black
                            text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6
                            lg:mb-0"
                        >
                            {primaryCta}
                        </a>
                        <a href={instagramUrl} className="mx-3 font-bold hover:underline">
                            {secondaryCta}
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
