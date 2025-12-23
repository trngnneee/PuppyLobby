export const ItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full rounded-xl py-3 px-5 bg-gray-100 animate-pulse">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 w-40 bg-gray-300 rounded"></div>

          {/* Subtitle */}
          <div className="h-3 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Price */}
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
    </div>
  );
};