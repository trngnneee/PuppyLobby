export const EmployeeRowSkeleton = () => {
  return (
    <tr className="border-t animate-pulse">
      {/* Employee Name */}
      <td className="px-4 py-2">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>

      {/* Date of Birth */}
      <td className="px-4 py-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>

      {/* Gender */}
      <td className="px-4 py-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>

      {/* Manager Name */}
      <td className="px-4 py-2">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
      </td>

      {/* Working Branch (Badge) */}
      <td className="px-4 py-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </td>

      {/* Actions (Dropdown Menu) */}
      <td className="px-4 py-2">
        <div className="h-8 w-8 bg-gray-200 rounded-md float-right mr-4"></div>
      </td>
    </tr>
  );
};