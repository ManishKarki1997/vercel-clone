import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Project } from '../types/project.types'

type Props = {
  project: Project;
}

function ProjectCard({
  project
}: Props) {
  return (
    <Card className='shadow-none hover:shadow-sm rounded cursor-pointer'>
      <CardHeader className='flex !flex-row items-start gap-2 '>
        <Avatar className='rounded mt-1'>
          <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${project.id}`} />
          <AvatarFallback>{project.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription className='line-clamp-2 m-1'>
            {project.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className='justify-between'>
        <Badge variant="default" className='bg-green-500'>Deployed</Badge>

        <p className='text-sm text-muted-foreground'>
          {new Date(project.createdAt).toLocaleString()}
        </p>
      </CardFooter>
    </Card>

  )
}

export default ProjectCard