export const Step1UISkeleton = () => {
  return (
    <>
      <div
        className="flex items-center justify-between border border-input p-4 first:rounded-t-md last:rounded-b-md"
      >
        <div className="flex items-center gap-3">
          {/* Radio */}
          <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />

          {/* Service name */}
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        </div>

        {/* Branch badges */}
        <div className="flex gap-2">
          <div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </>
  );
};
