export const SectionHeader = ({ title }) => {
  return (
    <>
      <div>
        <div className="text-[28px]">{title}</div>
        <div className="border-t-3 border-[var(--main)] w-[100px]"></div>
      </div>
    </>
  )
}