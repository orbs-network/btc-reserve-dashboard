import { cn } from "@/lib/utils"; // If you use shadcn's utility function

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={cn("animate-spin rounded-full border-4 border-[#D7DDFF] border-t-primary h-6 w-6", className)} />
  );
}