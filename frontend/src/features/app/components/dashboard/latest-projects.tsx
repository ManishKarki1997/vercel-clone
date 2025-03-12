import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { listDashboardAction } from '../../actions/app.action'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function LatestProjects() {
  const {
    data: dashboardData,
    isLoading: isLoadingDashboardData
  } = useQuery({
    queryFn: () => listDashboardAction({}),
    queryKey: ['app-dashboard']
  })


  const projectsList = dashboardData?.projects || []

  return (
    <div className='bg-secondary-foreground rounded-lg hover:shadow  px-6 py-6'>

      <div className='mb-4'>
        <h2 className='font-semibold text-lg'>Latest Projects</h2>
        <p>Check out your latest projects</p>
      </div>

      <div className='border border-muted'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Url</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isLoadingDashboardData &&
              Array.from(Array(4).keys()).map(i => (
                <TableRow key={i} className='py-2'>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            }
            {
              projectsList.map((project: any) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <div>
                      <Badge className={cn('bg-muted-foreground', { "bg-red-500": project.status === 'Archived' })}>{project.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <a href={project.deploymentUrl} target='_blank' className='hover:text-primary'>{project.deploymentUrl}</a>
                  </TableCell>
                </TableRow>

              ))
            }
          </TableBody>
        </Table>

      </div>
    </div>
  )
}

export default LatestProjects