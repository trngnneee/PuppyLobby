export const MedicalItemSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 bg-gray-100 shadow-sm space-y-3 animate-pulse">
      {/* Pet + Doctor */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 bg-gray-300 rounded" />
          <div className="h-5 w-24 bg-gray-300 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-14 bg-gray-300 rounded" />
          <div className="h-5 w-28 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Date + Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 bg-gray-300 rounded" />
          <div className="h-5 w-24 bg-gray-300 rounded" />
        </div>

        <div className="h-6 w-24 bg-gray-300 rounded-full" />
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
      </div>

      {/* Diagnosis */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
      </div>

      {/* Prescription */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-300 rounded" />
        <div className="h-4 w-5/6 bg-gray-300 rounded" />
        <div className="h-4 w-4/6 bg-gray-300 rounded" />
      </div>

      {/* Follow-up Date */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>
    </div>
  );
};
