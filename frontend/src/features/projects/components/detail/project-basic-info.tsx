import { Badge } from '@/components/ui/badge'
import React from 'react'
import { useProjectDetail } from '../../providers/project-detail-provider'
import { cn } from '@/lib/utils'

function ProjectBasicInfo() {


  const {
    project
  } = useProjectDetail()


  if (!project) return null


  return (
    <div>


      <div className="mb-6">
        <p
          className={cn('', { 'text-muted-foreground italic': !project.description })}
        >{project.description || "No description provided"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 xl:grid-cols-4 gap-4">

        <div>
          <p className='text-sm text-muted-foreground'>URL</p>
          <a href='https://project.example.com' className='font-medium'>{`http://${project.slug}.localhost:3001`}</a>
        </div>


        <div>
          <p className='text-sm text-muted-foreground'>Status</p>
          <Badge className={cn(project.status === "Active" ? 'bg-green-500' : "bg-red-500")}>{project.status}</Badge>
        </div>

      </div>
    </div>
  )
}

export default ProjectBasicInfo