export const PriceSummary = ({
  total,
  discount,
}) => {
  return (
    <div className="w-full rounded-xl p-4 space-y-4 border">

      <div className="flex justify-between text-sm">
        <span className="">Total:</span>
        <span className="font-medium">{total.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="">Discount:</span>
        <span className="font-medium">
          -{discount.toLocaleString()} VND
        </span>
      </div>

      <div className="flex justify-between text-base font-bold">
        <span className="">Payment:</span>
        <span className="text-lg">
          {(total - discount).toLocaleString()} VND
        </span>
      </div>
    </div>
  );
};
