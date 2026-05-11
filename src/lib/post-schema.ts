import { z } from "zod";

const authorSchema = z.object({
    name: z.string().min(1),
    picture: z.string().min(1),
});

const addressSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    link: z.string().url().optional(),
    addressLink: z.string().url().optional(),
});

const ogImageSchema = z.object({
    url: z.string().min(1),
});

export const postFrontMatterSchema = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.string().min(1).refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "date must be parseable by Date.parse",
    }),
    categories: z.array(z.string()).default([]),
    author: authorSchema,
    coverImage: z.string().optional(),
    ogImage: ogImageSchema.optional(),
    addresses: z.array(addressSchema).optional(),
    draft: z.boolean().optional(),
});

export type PostFrontMatter = z.infer<typeof postFrontMatterSchema>;

export type ValidationFailure = {
    slug: string;
    locale: string;
    issues: string[];
};

const FAIL_ON_INVALID = process.env.NODE_ENV === "production";
const seenWarnings = new Set<string>();

export function validateFrontMatter(
    raw: Record<string, unknown>,
    context: { slug: string; locale: string },
): PostFrontMatter | null {
    const result = postFrontMatterSchema.safeParse(raw);
    if (result.success) return result.data;

    const issues = result.error.issues.map(
        (issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`,
    );
    const failure: ValidationFailure = { ...context, issues };
    const key = `${context.locale}/${context.slug}`;

    if (FAIL_ON_INVALID) {
        const message = `Invalid front matter in _posts/${key}.md:\n  ${issues.join("\n  ")}`;
        throw new Error(message);
    }

    if (!seenWarnings.has(key)) {
        seenWarnings.add(key);
         
        console.warn(`[front-matter] ${key}:`, failure.issues);
    }
    return null;
}
