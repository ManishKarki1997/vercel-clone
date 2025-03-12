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

      <div className="grid grid-cols-12  gap-4">

        <div className='col-span-12'>
          <p className='text-sm text-muted-foreground'>URL</p>
          <a href='https://project.example.com' className='font-medium'>{project.deploymentUrl || "-"}</a>
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