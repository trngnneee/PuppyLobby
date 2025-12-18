export const VaccinePackageRowSkeleton = () => {
  return (
    <tr className="border-t animate-pulse">
      {/* Package Name */}
      <td className="px-4 py-4">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </td>

      {/* Duration */}
      <td className="px-4 py-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>

      {/* Discount Rate */}
      <td className="px-4 py-4">
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>

      {/* Schedule List */}
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-3 w-48 bg-gray-100 rounded"></div>
          <div className="h-3 w-52 bg-gray-100 rounded"></div>
          <div className="h-3 w-40 bg-gray-100 rounded"></div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="h-8 w-8 bg-gray-200 rounded-md inline-block"></div>
      </td>
    </tr>
  );
};