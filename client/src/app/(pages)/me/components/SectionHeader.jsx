export const SectionHeader = ({ title, className = '' }) => {
  return (
    <>
      <div className={`text-[36px] font-bold text-[var(--main)] ${className}`}>{title}</div>
    </>
  )
}