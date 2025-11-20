export default function AuthLayout({ children }) {
  return (
    <div className="flex mx-auto my-10 container rounded-[20px] shadow-2xl gap-5 border border-gray-200">
      <div className="flex-1 px-10 py-5">
        {children}
      </div>

      <div className="w-[800px] h-auto overflow-hidden">
        <img
          src="/auth-bg.jpg"
          className="w-full h-full object-contain rounded-r-[20px] border-l-gray-200 border-l"
        />
      </div>
    </div>
  )
}