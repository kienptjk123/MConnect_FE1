"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import labelApiRequest from "@/apiRequests/label";
import { useQuery } from "@tanstack/react-query";

interface Label {
  id: number;
  name: string;
  slug: string;
}

interface LabelMultiSelectProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function LabelMultiSelect({
  value = [],
  onChange,
  placeholder = "Select labels...",
  className,
  disabled = false,
}: LabelMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data: labelsResponse, isLoading } = useQuery({
    queryKey: ["labels"],
    queryFn: labelApiRequest.getAllLabels,
  });

  const labels: Label[] = labelsResponse?.payload?.data || [];
  const selectedLabels = labels.filter((label) => value.includes(label.id));

  const handleSelect = (labelId: number) => {
    const newValue = value.includes(labelId)
      ? value.filter((id) => id !== labelId)
      : [...value, labelId];
    onChange?.(newValue);
  };

  const handleRemove = (labelId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const newValue = value.filter((id) => id !== labelId);
    onChange?.(newValue);
  };

  const handleClear = () => {
    onChange?.([]);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedLabels.length > 0
                ? `${selectedLabels.length} label${
                    selectedLabels.length > 1 ? "s" : ""
                  } selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search labels..." className="h-9" />
            <CommandEmpty>
              {isLoading ? "Loading..." : "No label found."}
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {labels.map((label) => (
                  <CommandItem
                    key={label.id}
                    value={label.name}
                    onSelect={() => handleSelect(label.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(label.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {label.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Labels Display */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedLabels.map((label) => (
            <Badge key={label.id} variant="secondary" className="text-xs">
              {label.name}
              <button
                type="button"
                className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                onClick={(e) => handleRemove(label.id, e)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedLabels.length > 1 && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleClear}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
