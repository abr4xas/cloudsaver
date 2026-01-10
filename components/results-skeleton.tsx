export function ResultsSkeleton() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="h-12 w-3/4 mx-auto bg-zinc-800 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 h-64 bg-zinc-800 rounded-2xl animate-pulse" />
                    <div className="space-y-6">
                        <div className="h-32 bg-zinc-800 rounded-2xl animate-pulse" />
                        <div className="h-32 bg-zinc-800 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
