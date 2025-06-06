
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardEdit, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const FormSchema = z.object({
  patientData: z.string().min(10, {
    message: "Patient data must be at least 10 characters.", // This message could also be translated
  }),
});

type PatientDataFormProps = {
  onSubmit: (data: z.infer<typeof FormSchema>) => Promise<void>;
  isLoading: boolean;
};

export default function PatientDataForm({ onSubmit, isLoading }: PatientDataFormProps) {
  const { translations } = useLanguage();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      patientData: "",
    },
  });
  
  // Update Zod schema message based on language if needed, or handle in FormMessage
  // For simplicity, keeping English, but this could be dynamic:
  // const dynamicFormSchema = z.object({
  //   patientData: z.string().min(10, {
  //     message: translations.patientDataMinLengthError || "Patient data must be at least 10 characters.",
  //   }),
  // });
  // And then use dynamicFormSchema in useForm resolver.

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <ClipboardEdit className="h-6 w-6 text-primary" />
          {translations.patientDataInputTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.patientDataLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translations.patientDataPlaceholder}
                      className="min-h-[150px] resize-y"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.processingButton}
                </>
              ) : (
                translations.getScoresButton
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
