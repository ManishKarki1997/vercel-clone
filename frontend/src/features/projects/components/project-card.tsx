import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Project } from '../types/project.types'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'

type Props = {
  project: Project;
}

function ProjectCard({
  project
}: Props) {

  const navigate = useNavigate()

  return (
    <Card
      className='shadow-none hover:shadow-sm rounded cursor-pointer '
      onClick={() => navigate(`/app/projects/${project.slug}`)}
    >
      <CardHeader className='flex !flex-row items-start gap-2 w-full py-5 px-6'>
        <Avatar className='rounded mt-1'>
          <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${project.id}`} />
          <AvatarFallback>{project.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <div className="flex items-center gap-2">
            <CardTitle>{project.name}</CardTitle>
            <Badge className={cn(project.status === "Active" ? 'bg-green-500' : "bg-red-500")}>{project.status}</Badge>

          </div>

          <CardDescription className={cn('line-clamp-2 mt-1', { 'text-muted-foreground italic': !project.description })}>
            {project.description || "No description provided"}
          </CardDescription>
        </div>

      </CardHeader>
      {/* <CardFooter className='justify-between'>
        <Badge className={cn(project.status === "Active" ? 'bg-green-500' : "bg-red-500")}>{project.status}</Badge>

        <p className='text-sm text-muted-foreground'>
          {new Date(project.createdAt).toLocaleString()}
        </p>
      </CardFooter> */}
    </Card>

  )
}

export default ProjectCard