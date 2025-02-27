import { Skeleton } from '../ui/skeleton'

function AppDashboardSkeleton() {
  return (
    <div className='px-4 py-4'>
      <Skeleton className="w-full h-[80px] rounded" />

      <Skeleton className="mt-10 w-full h-[calc(100vh-170px)] rounded" />
    </div>
  )
}

export default AppDashboardSkeleton