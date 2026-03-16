import { useTranslations } from "next-intl";
import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen px-4 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start py-12">
        {/* Left Side: Hero content */}
        <div className="flex flex-col items-center lg:items-start order-last lg:order-first text-center lg:text-left mt-12 lg:mt-24">
          <Image
            src="/img/hero-pencil.png"
            alt="Hero"
            className="mix-blend-luminosity"
            width={800}
            height={800}
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {t("title")}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-lg">
            Pulikkunnil Sree Subramanya Swami Kshethram
          </p>
        </div>

        {/* Right Side: Booking Form */}
        <div className="order-first lg:order-last w-full flex justify-center lg:justify-end">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
