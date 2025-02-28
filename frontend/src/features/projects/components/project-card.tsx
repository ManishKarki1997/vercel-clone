import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function ProjectCard() {
  return (
    <Card className='shadow-none hover:shadow-sm rounded cursor-pointer'>
      <CardHeader className='flex !flex-row items-start gap-2 '>
        <Avatar className='rounded mt-1'>
          <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${'project'}`} />
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>Kafka</CardTitle>
          <CardDescription className='line-clamp-2 m-1'>
            The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className='justify-between'>
        <Badge variant="default" className='bg-green-500'>Deployed</Badge>

        <p className='text-sm text-muted-foreground'>
          {new Date().toLocaleString()}
        </p>
      </CardFooter>
    </Card>

  )
}

export default ProjectCard