export default function AuthLayout({ children }) {
  return (
    <div className="flex mx-auto my-15 container rounded-[20px] shadow-2xl gap-5 border border-gray-200">
      <div className="w-[800px] h-auto overflow-hidden">
        <img
          src="/auth-bg.avif"
          className="w-full h-full object-contain rounded-l-[20px] border-r-gray-200 border-r"
        />
      </div>

      <div className="flex-1 px-10 py-10">
        {children}
      </div>
    </div>
  )
}