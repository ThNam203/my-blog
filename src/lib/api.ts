import { Post } from "@/interfaces/post";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");
const localizedPostsDirectory = (locale: Locale) => join(postsDirectory, locale);

function resolvePostsDirectory(locale: Locale) {
  const localeDir = localizedPostsDirectory(locale);
  if (fs.existsSync(localeDir)) {
    return localeDir;
  }
  return postsDirectory;
}

export function getPostSlugs(locale: string = defaultLocale) {
  if (!isValidLocale(locale)) {
    return [];
  }

  const targetDirectory = resolvePostsDirectory(locale);
  return fs.readdirSync(targetDirectory).filter((fileName) => fileName.endsWith(".md"));
}

export function getPostBySlug(slug: string, locale: string = defaultLocale) {
  if (!isValidLocale(locale)) {
    return null;
  }

  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(resolvePostsDirectory(locale), `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(locale: string = defaultLocale): Post[] {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
