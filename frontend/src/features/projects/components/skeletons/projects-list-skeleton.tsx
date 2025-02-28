import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function ProjectsListSkeleton() {
  return (
    <>
      {
        Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className='w-full h-32 rounded-lg' />
        ))
      }
    </>
  )
}

export default ProjectsListSkeleton