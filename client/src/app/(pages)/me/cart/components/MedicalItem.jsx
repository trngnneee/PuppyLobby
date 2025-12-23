export const MedicalItem = ({ item }) => {
  return (
    <>
      <div className="flex items-center justify-between w-full rounded-xl py-3 px-5 bg-gray-100">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-2">Medical Examination</h3>
            <p className="text-gray-500 text-sm">Pet: {item.pet_name} - Doctor: {item.employee_name}</p>
          </div>
        </div>
        <div className="font-semibold">{parseInt(item.price).toLocaleString("vi-VN")} VND</div>
      </div>
    </>
  )
}