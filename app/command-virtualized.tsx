"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, UserIcon } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import {
  CommandAutoComplete,
  CommandDialog,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FixedSizeList as List } from "react-window";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ITEM_SIZE = 70; // Adjust this based on your design

type Option = {
  name: any;
  login: any;
  picture: any;
  value: string;
  id: number;
  firstName: string;
  lastName: string;
  img_url: string;
};

type CommandDialogVirtualProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  isPending: boolean;
  options: Option[];
};

/**
 * A virtualized CommandDialog component that displays a list of options in a dropdown menu.
 * @param {string} value - The value to be displayed in the input field
 * @param {function} onValueChange - The function to be called when the value changes
 * @param {boolean} disabled - Whether the input field is disabled
 * @param {boolean} isPending - Whether the list of options is being fetched
 * @param {Option[]} options - An array of options to be displayed in the dropdown menu
 * @returns {ReactNode} - The JSX for the CommandDialogVirtual component
 */
export function CommandDialogVirtual({
  value,
  onValueChange,
  disabled,
  isPending,
  options,
}: CommandDialogVirtualProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      if (selectedOption.value !== value) {
        setInputValue(selectedOption.value);
        onValueChange(selectedOption.value);
      } else {
        setInputValue("");
        onValueChange("");
      }
    },
    [onValueChange, value]
  );

  const filteredOptions = useMemo(() => {
    if (isPending) return [];
    if (!inputValue) return options;
    return options.filter((option) =>
      option.value.toUpperCase().includes(inputValue.toUpperCase())
    );
  }, [inputValue, options, isPending]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const option = filteredOptions[index];
    const isSelected = selected?.value === option.value;
    return (
      <div style={style}>
        <CommandItem
          key={option.value}
          value={option.value}
          onSelect={() => handleSelectOption(option)}
          className={cn(
            "flex w-full items-center gap-2",
            !isSelected ? "pl-2" : null
          )}
        >
          {isSelected ? <Check className="w-4" /> : null}
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={option.img_url}
              className="object-contain"
              alt={option.value}
            />
            <AvatarFallback>
              <UserIcon className="h-8 w-8 items-center" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{option.value}</p>
          </div>
        </CommandItem>
      </div>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <p className="text-sm text-muted-foreground">
          Search...{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl + J</span>
          </kbd>
        </p>
      </Button>
      <CommandDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
        <CommandAutoComplete
          ref={inputRef}
          value={inputValue}
          onValueChange={isPending ? undefined : setInputValue}
          className="text-base"
          placeholder="Type to search..."
        />
        <CommandList className="min-h-[600px]">
          {isPending ? (
            <CommandPrimitive.Loading>
              <div className="p-1">
                <Skeleton className="h-8 w-full" />
              </div>
            </CommandPrimitive.Loading>
          ) : null}
          {filteredOptions.length > 0 && !isPending ? (
            <List
              height={600} // Adjust the height as needed
              itemCount={filteredOptions.length}
              itemSize={ITEM_SIZE}
              width="100%"
            >
              {Row}
            </List>
          ) : null}
          {!isPending && filteredOptions.length === 0 ? (
            <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
              No results found...
            </CommandPrimitive.Empty>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
