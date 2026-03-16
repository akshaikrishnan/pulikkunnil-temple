"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Trash2, PlusCircle, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

const NAKSHATRAS = [
  "Aswathi",
  "Bharani",
  "Karthika",
  "Rohini",
  "Makayiram",
  "Thiruvathira",
  "Punartham",
  "Pooyam",
  "Aayilyam",
  "Makam",
  "Pooram",
  "Uthram",
  "Atham",
  "Chithira",
  "Chothi",
  "Visakham",
  "Anizham",
  "Thrikketta",
  "Moolam",
  "avittom",
  "Chathayam",
  "Pooruruttathi",
  "Uthrattathi",
  "Revathi",
];

const SEVAS = [
  "Pushpanjali",
  "Archana",
  "Ganapathy Homam",
  "Bhagavathy Seva",
  "Chuttuvilakku",
];

const TIME_SLOTS = [
  "05:00 AM - 06:00 AM",
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "05:30 PM - 06:30 PM",
  "06:30 PM - 07:30 PM",
];

const getFormSchema = (t: any) =>
  z
    .object({
      fullName: z.string().min(2, { message: t("validation.required") }),
      phoneNumber: z
        .string()
        .min(10, { message: t("validation.invalidPhone") }),
      starSign: z.string().min(1, { message: t("validation.required") }),
      date: z.date({
        message: t("validation.required"),
      }),
      timeSlot: z.string().min(1, { message: t("validation.required") }),
      offerings: z
        .array(
          z.object({
            sevaType: z.string().min(1, { message: t("validation.required") }),
            bookForOther: z.boolean().default(false).optional(),
            otherPersonName: z.string().optional(),
            otherPersonStar: z.string().optional(),
          }),
        )
        .max(10, { message: t("validation.maxOfferings") }),
    })
    .superRefine((data, ctx) => {
      // If bookForOther is true, otherPersonName and otherPersonStar shouldn't be empty
      data.offerings.forEach((offering, index) => {
        if (offering.bookForOther) {
          if (
            !offering.otherPersonName ||
            offering.otherPersonName.trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.required"),
              path: ["offerings", index, "otherPersonName"],
            });
          }
          if (
            !offering.otherPersonStar ||
            offering.otherPersonStar.trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.required"),
              path: ["offerings", index, "otherPersonStar"],
            });
          }
        }
      });
    });

export function BookingForm() {
  const t = useTranslations("BookingForm");
  const formSchema = getFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      starSign: "",
      timeSlot: "",
      offerings: [
        {
          sevaType: "",
          bookForOther: false,
          otherPersonName: "",
          otherPersonStar: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "offerings",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Submit logic here
  }

  return (
    <div className="bg-[#FAF8F5] p-6 md:p-8 rounded-xl border border-[#D1B17F]/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-xl  mx-auto h-full flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#b58133] text-center uppercase mb-1 tracking-wider">
        {t("title")}
      </h2>
      <div className="flex justify-center mb-6">
        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D1B17F] to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D1B17F] text-lg">
            ❖
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-h-[600px] overflow-y-auto pr-2 custom-scroll px-2.5"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#5c5040] uppercase">
              {t("section1Title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5c5040] font-semibold">
                      {t("fullName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("fullNamePlaceholder")}
                        {...field}
                        className="bg-transparent border-[#D1B17F] rounded-lg focus-visible:ring-[#b58133]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5c5040] font-semibold">
                      {t("phoneNumber")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("phoneNumberPlaceholder")}
                        {...field}
                        className="bg-transparent border-[#D1B17F] rounded-lg focus-visible:ring-[#b58133]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="starSign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#5c5040] font-semibold">
                    {t("starSign")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-100 border-[#D1B17F] rounded-lg focus:ring-[#b58133] relative">
                        <SelectValue placeholder={t("selectNakshatra")} />
                        <Star className="w-4 h-4 text-gray-400 absolute right-8 top-1/2 -translate-y-1/2" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NAKSHATRAS.map((star) => (
                        <SelectItem key={star} value={star}>
                          {star}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[#5c5040] font-semibold mt-2">
                      {t("date")}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            type="button"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-transparent border-[#D1B17F] rounded-lg focus-visible:ring-[#b58133]",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>{t("datePlaceholder")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5c5040] font-semibold">
                      {t("timeSlot")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-[#D1B17F] rounded-lg focus:ring-[#b58133]">
                          <SelectValue placeholder={t("selectTime")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t border-[#D1B17F]/30 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#5c5040] uppercase">
              {t("section2Title")}
            </h3>
            <p className="text-xs font-semibold text-[#5c5040] uppercase">
              {t("yourSevas")}
            </p>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-[#FAF8F5] rounded-xl border border-[#D1B17F] p-4 relative shadow-sm"
              >
                <div className="absolute -left-3 top-4 w-6 h-6 rounded flex items-center justify-center bg-[#ca9e54] text-white font-bold text-sm shadow">
                  {index + 1}.
                </div>

                <div className="ml-2 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <FormField
                      control={form.control}
                      name={`offerings.${index}.sevaType`}
                      render={({ field }: any) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[#5c5040] font-semibold">
                            {t("sevaType")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-50 border-[#D1B17F] rounded-lg focus:ring-[#b58133]">
                                <SelectValue placeholder={t("selectSeva")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SEVAS.map((seva) => (
                                <SelectItem key={seva} value={seva}>
                                  {seva}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 text-gray-500 hover:text-red-500"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`offerings.${index}.bookForOther`}
                    render={({ field }: any) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#D1B17F] text-[#b58133] focus-visible:ring-[#b58133]"
                          />
                        </FormControl>
                        <div className="leading-none text-sm text-[#5c5040]">
                          <FormLabel>{t("bookForOther")}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch(`offerings.${index}.bookForOther`) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#D1B17F]/20 mt-2">
                      <FormField
                        control={form.control}
                        name={`offerings.${index}.otherPersonName`}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[#5c5040] font-semibold">
                              {t("otherPersonName")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("otherPersonNamePlaceholder")}
                                {...field}
                                className="bg-transparent border-[#D1B17F] rounded-lg focus-visible:ring-[#b58133]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`offerings.${index}.otherPersonStar`}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[#5c5040] font-semibold">
                              {t("otherPersonStar")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-transparent border-[#D1B17F] rounded-lg focus:ring-[#b58133]">
                                  <SelectValue placeholder={t("selectStar")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {NAKSHATRAS.map((star) => (
                                  <SelectItem key={star} value={star}>
                                    {star}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {fields.length < 10 && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-[#D1B17F] text-[#b58133] hover:bg-[#D1B17F]/10 hover:text-[#b58133] rounded-xl py-6"
                onClick={() =>
                  append({
                    sevaType: "",
                    bookForOther: false,
                    otherPersonName: "",
                    otherPersonStar: "",
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("addNewOffering")}
              </Button>
            )}

            {fields.length >= 10 && (
              <p className="text-xs text-center text-red-500">
                {t("validation.maxOfferings")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#cc8c18] hover:bg-[#b07812] text-white rounded-xl py-6 text-lg font-bold"
          >
            {t("bookNow")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
