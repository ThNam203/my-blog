import { redirect } from "next/navigation";
import { defaultLocale, isValidLocale } from "@/i18n/config";

type Props = {
  params: Promise<{
    path?: string[];
  }>;
};

export default async function PathPrefixRedirectPage({ params }: Props) {
  const { path = [] } = await params;
  const [firstSegment] = path;

  if (firstSegment && isValidLocale(firstSegment)) {
    redirect(`/${path.join("/")}`);
  }

  const suffix = path.length > 0 ? `/${path.join("/")}` : "";
  redirect(`/${defaultLocale}${suffix}`);
}
