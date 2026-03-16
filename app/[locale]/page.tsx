import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen flex-col items-center pt-24">
      <h1 className="text-4xl font-bold text-foreground">
        {t("title")}
      </h1>
      <p className="mt-4 text-muted-foreground text-lg">
        Pulikkunnil Sree Subramanya Swami Kshethram
      </p>
    </div>
  );
}
