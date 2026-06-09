import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export default function ReelCardSkeleton() {
  return (
    <Card variant="glass" className="aspect-[9/16] w-full">
      {/* Background skeleton */}
      <Skeleton className="w-full h-full rounded-none" />
      
      {/* Category badge skeleton */}
      <div className="absolute top-3 left-3">
        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
      </div>
      
      {/* Info bar skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-1/4 bg-white/10" />
          <Skeleton className="h-4 w-1/4 bg-white/10" />
        </div>
      </div>
    </Card>
  );
}
