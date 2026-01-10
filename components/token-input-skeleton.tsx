export function TokenInputSkeleton() {
    return (
        <section
            id="token-input"
            className="px-4 py-32 relative flex flex-col items-center"
        >
            <div className="max-w-xl w-full space-y-6 animate-pulse">
                <div className="h-12 w-3/4 mx-auto bg-zinc-800 rounded-lg" />
                <div className="h-6 w-1/2 mx-auto bg-zinc-800 rounded-lg" />
                <div className="h-14 w-full bg-zinc-800 rounded-xl" />
            </div>
        </section>
    );
}
