export const MedicineItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
      {/* Radio */}
      <div className="mr-3 h-4 w-4 rounded-full bg-muted" />

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-40 rounded bg-muted" />

        <div className="h-3 w-48 rounded bg-muted/70" />
        <div className="h-3 w-44 rounded bg-muted/70" />
        <div className="h-3 w-36 rounded bg-muted/70" />
      </div>

      {/* Stock + Price */}
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
    </div>
  )
}
