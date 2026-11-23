"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen((prev) => !prev);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 cursor-pointer text-left shadow-sm",
          "border-[#DECBB0] dark:border-[#3D352F] bg-[#FCF0DA]/50 dark:bg-[#1E1A17]",
          "text-[#4C4541] dark:text-[#FBF3E6]",
          isOpen
            ? "border-[#AEAC78] ring-2 ring-[#AEAC78]/20"
            : "hover:border-[#AEAC78]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn("truncate block", !selectedOption && "text-[#7A6F68]/70 dark:text-[#B5AAA0]/70")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 ml-2 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180 text-[#AEAC78]" : "text-[#7A6F68] dark:text-[#B5AAA0]"
          )}
        />
      </button>

      {/* Popover list */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-[#DECBB0] dark:border-[#3D352F] bg-[#FFF8ED] dark:bg-[#24201C] p-1.5 shadow-xl max-h-60 overflow-y-auto"
        >
          {placeholder && (
            <div
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect("")}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                !value
                  ? "bg-[#F2C46A]/25 dark:bg-[#F2C46A]/15 text-[#2D2305] dark:text-[#F2C46A] font-semibold"
                  : "text-[#7A6F68] dark:text-[#B5AAA0] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823]"
              )}
            >
              <span>{placeholder}</span>
              {!value && <Check className="h-3.5 w-3.5 text-[#AEAC78]" />}
            </div>
          )}

          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                  isSelected
                    ? "bg-[#F2C46A]/25 dark:bg-[#F2C46A]/15 text-[#2D2305] dark:text-[#F2C46A] font-semibold"
                    : isHighlighted
                    ? "bg-[#F5E5C9] dark:bg-[#2D2823] text-[#4C4541] dark:text-[#FBF3E6]"
                    : "text-[#4C4541] dark:text-[#FBF3E6] hover:bg-[#F5E5C9] dark:hover:bg-[#2D2823]"
                )}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#AEAC78]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
