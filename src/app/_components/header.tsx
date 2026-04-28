import Link from "next/link";
import { type Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  title: string;
};

const Header = ({ locale, title }: Props) => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center">
      <Link href={`/${locale}`} className="hover:underline">
        {title}
      </Link>
      .
    </h2>
  );
};

export default Header;
