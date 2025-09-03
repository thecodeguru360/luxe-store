import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeFilters(filters: Record<string, any>): string {
  const entries: [string, string][] = [];

  function flatten(obj: Record<string, any>, prefix = "") {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        flatten(value, fullKey);
      } else {
        entries.push([`f_${fullKey}`, String(value)]);
      }
    });
  }

  flatten(filters);
  return new URLSearchParams(entries).toString();
}

export function decodeFilters(search: string): Record<string, any> {
  const urlParams = new URLSearchParams(search);
  const filters: Record<string, any> = {};

  urlParams.forEach((value, key) => {
    if (key.startsWith("f_")) {
      const path = key.slice(2).split(".");
      let current: any = filters;

      path.forEach((part, idx) => {
        if (idx === path.length - 1) {
          // last key → assign value
          current[part] = value;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    }
  });

  return filters;
}
