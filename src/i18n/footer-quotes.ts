import type { Locale } from "./config";

export type FooterQuote = {
    text: string;
    author?: string;
};

export const footerQuotesByLocale: Record<Locale, FooterQuote[]> = {
    vi: [
        {
            text: "Trên đời này làm gì có đường, người ta đi mãi thì thành đường thôi",
            author: "Lỗ Tấn",
        },
        {
            text: 'Trong văn hoá Ba Tư, khi bạn khen ai đó xinh đẹp.\nNgười ta sẽ đáp lại rằng:\n"Là do đôi mắt của bạn đẹp."',
        },
        {
            text: "Bạn không cần hoàn hảo để bắt đầu; bạn cần bắt đầu để trở nên hoàn hảo.",
            author: "Zig Ziglar",
        },
        {
            text: "Viết một cuốn tiểu thuyết cũng giống như lái xe vào ban đêm. Bạn chỉ có thể nhìn thấy mọi thứ trong tầm chiếu sáng của đèn pha, nhưng nhờ vậy mà bạn có thể đi đến cuối hành trình.",
            author: "E. L. Doctorow (Trích Viết & Sống)",
        },
    ],
    en: [
        {
            text: "For actually there is no road on the earth; when many people pass one way, a road is made.",
            author: "Lu Xun",
        },
        {
            text: 'In Persian culture, when you compliment someone\'s beauty.\nThey will reply:\n"It is because of the beauty of your eyes."',
        },
        {
            text: "You don't have to be great to start, but you have to start to be great",
            author: "Zig Ziglar",
        },
        {
            text: "Writing is like driving at night in the fog. You can only see as far as your headlights, but you can make the whole trip that way.",
            author: "E. L. Doctorow",
        },
    ],
};
