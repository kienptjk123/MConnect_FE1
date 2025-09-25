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
import categoriesApiRequest from "@/apiRequests/categories";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryMultiSelectProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CategoryMultiSelect({
  value = [],
  onChange,
  placeholder = "Select categories...",
  className,
  disabled = false,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApiRequest.getAllCategories,
  });

  const categories: Category[] = categoriesResponse?.payload?.data || [];
  const selectedCategories = categories.filter((category) =>
    value.includes(category.id)
  );

  const handleSelect = (categoryId: number) => {
    const newValue = value.includes(categoryId)
      ? value.filter((id) => id !== categoryId)
      : [...value, categoryId];
    onChange?.(newValue);
  };

  const handleRemove = (categoryId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const newValue = value.filter((id) => id !== categoryId);
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
              {selectedCategories.length > 0
                ? `${selectedCategories.length} category${
                    selectedCategories.length > 1 ? "ies" : "y"
                  } selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." className="h-9" />
            <CommandEmpty>
              {isLoading ? "Loading..." : "No category found."}
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleSelect(category.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(category.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategories.map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
              <button
                type="button"
                className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                onClick={(e) => handleRemove(category.id, e)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCategories.length > 1 && !disabled && (
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
