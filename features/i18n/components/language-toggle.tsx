"use client";

import { LanguagesIcon } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { useI18n } from "../provider";

type LanguageToggleProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageToggle({
  compact = false,
  className,
}: LanguageToggleProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/85 p-1",
        className,
      )}
    >
      {!compact && (
        <div className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
          <LanguagesIcon className="size-3.5" />
          <span>{t("common.language")}</span>
        </div>
      )}
      <Button
        size="sm"
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
        className="h-7 rounded-full px-3 text-xs"
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
      <Button
        size="sm"
        type="button"
        variant={locale === "zh-CN" ? "default" : "ghost"}
        className="h-7 rounded-full px-3 text-xs"
        onClick={() => setLocale("zh-CN")}
      >
        中
      </Button>
    </div>
  );
}
