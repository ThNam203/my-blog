import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Index({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const allPosts = getAllPosts(locale);

  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  if (!heroPost) {
    return null;
  }

  return (
    <main>
      <Container>
        <Intro heading={dictionary.ui.blogHeading} />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
          locale={locale}
        />
        {morePosts.length > 0 && (
          <MoreStories posts={morePosts} locale={locale} title={dictionary.ui.moreStories} />
        )}
      </Container>
    </main>
  );
}
