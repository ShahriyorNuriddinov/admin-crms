import { Skeleton } from "@/components/ui/skeleton";

export const MangaCourseCardSkeleton = () => {
  return (
    <div className="w-full max-w-md space-y-4 flex flex-col justify-between rounded-lg border border-muted p-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <Skeleton className="h-5 w-full rounded-lg" />

      <div className="space-y-3">
        {/* <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div> */}
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-lg" />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
};
