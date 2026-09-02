declare module 'lucide-react';

declare module 'date-fns' {
  export function format(date: Date | number | string, formatStr: string, options?: any): string;
  export function formatDistance(date: Date | number | string, baseDate: Date | number | string, options?: any): string;
  export function formatRelative(date: Date | number | string, baseDate: Date | number | string, options?: any): string;
  export function isAfter(date: Date | number | string, dateToCompare: Date | number | string): boolean;
  export function isBefore(date: Date | number | string, dateToCompare: Date | number | string): boolean;
  export function isValid(date: any): boolean;
  export function parseISO(argument: string, options?: any): Date;
  export function addDays(date: Date | number | string, amount: number): Date;
  export function subDays(date: Date | number | string, amount: number): Date;
}

declare module 'date-fns/locale' {
  export const th: any;
  export const enUS: any;
}
