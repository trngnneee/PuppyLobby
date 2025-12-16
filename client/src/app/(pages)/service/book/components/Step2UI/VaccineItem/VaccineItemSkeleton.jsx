export const VaccineItemSkeleton = () => {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-lg border p-4
        animate-pulse
      "
    >
      <div className="mr-3 h-4 w-4 rounded-full bg-gray-300" />

      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-25 rounded bg-gray-300" />

        <div className="h-3 w-10 rounded bg-gray-200" />
        <div className="h-3 w-10 rounded bg-gray-200" />
        <div className="h-3 w-10 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-6 rounded bg-gray-300" />
        <div className="h-4 w-6 rounded bg-gray-300" />
      </div>
    </div>
  )
}
