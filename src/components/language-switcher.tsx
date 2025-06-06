
"use client";

import { useLanguage, type Locale, AllTranslations } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const { language, setLanguage, translations } = useLanguage();

  const locales: Locale[] = ['de', 'en', 'nl'];

  const getLanguageName = (locale: Locale) => {
    if (locale === 'de') return AllTranslations[language].german;
    if (locale === 'en') return AllTranslations[language].english;
    if (locale === 'nl') return AllTranslations[language].dutch;
    return locale.toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{translations.switchLanguageTo}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{translations.switchLanguageTo}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => setLanguage(locale)}
            disabled={language === locale}
          >
            {getLanguageName(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
