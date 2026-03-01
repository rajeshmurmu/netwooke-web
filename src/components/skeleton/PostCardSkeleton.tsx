import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = () => {
    return (
        <Card className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                </div>

                <Skeleton className="w-6 h-6 rounded-md" />
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
            </div>

            {/* Media (optional placeholder) */}
            <Skeleton className="w-full h-60 rounded-2xl mb-4" />

            {/* Tags */}
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-10 rounded-full" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-28 rounded-2xl" />
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                </div>

                <Skeleton className="h-10 w-32 rounded-2xl" />
            </div>
        </Card>
    );
};