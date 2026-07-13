export const FontGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="rounded-lg border border-white/5 bg-[#141414] p-4 animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-5 w-16 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2">
          <div className="h-7 w-full rounded bg-white/5" />
          <div className="h-5 w-3/4 rounded bg-white/5" />
        </div>
      </div>
    ))}
  </div>
);
