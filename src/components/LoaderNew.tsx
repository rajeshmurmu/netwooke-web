import { cn } from "@/lib/utils";

export default function LoaderNew({ className }: { className?: string }) {
    return (
        <div className={cn(`min-h-screenn flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4`, className)}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}
