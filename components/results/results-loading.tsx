"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ResultsLoading() {
    return (
        <section className="py-20 px-4 min-h-[60vh] flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-3/4 max-w-lg rounded-xl" />
                    <Skeleton className="h-6 w-1/2 max-w-sm rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
                    <Skeleton className="h-96 rounded-2xl" />
                </div>
            </div>
        </section>
    );
}
