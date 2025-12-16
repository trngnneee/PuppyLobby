export const VaccinePackageItemSkeleton = () => {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-lg border p-4
        animate-pulse
      "
    >
      {/* Radio */}
      <div className="mr-3 h-4 w-4 rounded-full bg-gray-300" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Name */}
        <div className="h-4 w-32 rounded bg-gray-300" />

        {/* Description */}
        <div className="h-3 w-48 rounded bg-gray-200" />

        {/* Duration */}
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>

      {/* Price */}
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-20 rounded bg-gray-300" />
      </div>
    </div>
  );
};
