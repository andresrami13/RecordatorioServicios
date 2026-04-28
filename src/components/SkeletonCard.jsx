export default function SkeletonCard() {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-4 w-2/3 rounded-lg" />
          <div className="skeleton h-3 w-1/3 rounded-lg" />
        </div>
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  )
}
