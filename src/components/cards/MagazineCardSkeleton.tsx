const MagazineCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="px-4 pt-4">
        <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-300" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-4">
        <div className="h-6 w-3/4 rounded bg-gray-300" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-4/6 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default MagazineCardSkeleton

