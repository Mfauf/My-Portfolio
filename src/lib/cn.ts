type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Tiny classnames joiner. Enough for conditional Tailwind classes without
 * pulling in a dependency — we never need `clsx`'s object syntax here.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }

  return out.join(' ');
}
