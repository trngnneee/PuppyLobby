export const ProductRowSkeleton = () => {
  return (
    <tr className="border-t animate-pulse">
      {/* product_name */}
      <td className="px-4 py-2">
        <div className="h-4 w-36 rounded bg-muted" />
      </td>

      {/* image */}
      <td className="px-4 py-2">
        <div className="h-[50px] rounded bg-muted" />
      </td>

      {/* price */}
      <td className="px-4 py-2">
        <div className="h-4 w-15 rounded bg-muted" />
      </td>

      {/* manufacture_date */}
      <td className="px-4 py-2">
        <div className="h-4 w-16 rounded bg-muted" />
      </td>

      {/* entry_date */}
      <td className="px-4 py-2">
        <div className="h-4 w-16 rounded bg-muted" />
      </td>

      {/* expiry_date */}
      <td className="px-4 py-2">
        <div className="h-4 w-16 rounded bg-muted" />
      </td>

      {/* size */}
      <td className="px-4 py-2">
        <div className="h-4 w-8 rounded bg-muted" />
      </td>

      {/* color */}
      <td className="px-4 py-2">
        <div className="h-4 w-7 rounded bg-muted" />
      </td>

      {/* material */}
      <td className="px-4 py-2">
        <div className="h-4 w-15 rounded bg-muted" />
      </td>

      {/* actions */}
      <td className="px-4 py-2">
        <div className="h-8 w-5 rounded-md bg-muted" />
      </td>
    </tr>
  )
}