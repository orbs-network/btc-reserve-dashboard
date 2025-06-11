import { Skeleton } from "./skeleton";

export const LoadingContent = ({
    children,
    isLoading,
    className,
  }: {
    children: React.ReactNode;
    isLoading: boolean;
    className?: string;
  }) => {
    if (isLoading) return <Skeleton className={`w-full h-[20px] rounded-lg ${className}`} />;
    return <>{children}</>;
  };