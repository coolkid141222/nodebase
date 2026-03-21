"use client";

import { useMemo } from "react";
import { BracesIcon } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import type { TemplateVariableOption } from "./template-variables";

type Props = {
  options: TemplateVariableOption[];
  onSelect: (value: string) => void;
  label?: string;
};

export function TemplateVariablePicker({
  options,
  onSelect,
  label = "Insert variable",
}: Props) {
  const groupedOptions = useMemo(() => {
    const groups = new Map<string, TemplateVariableOption[]>();

    for (const option of options) {
      const current = groups.get(option.group) ?? [];
      current.push(option);
      groups.set(option.group, current);
    }

    return Array.from(groups.entries());
  }, [options]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <BracesIcon className="size-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px]">
        {groupedOptions.map(([group, groupOptions], index) => (
          <div key={group}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{group}</DropdownMenuLabel>
            {groupOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onSelect(option.value)}
                className="flex flex-col items-start gap-1 py-2"
              >
                <div className="text-sm font-medium">{option.label}</div>
                <code className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {option.value}
                </code>
                {option.hint ? (
                  <div className="text-xs text-muted-foreground">
                    {option.hint}
                  </div>
                ) : null}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
