import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout role="student">
      <div className="flex flex-col gap-6 min-w-0">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-5 h-40 flex flex-col gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
