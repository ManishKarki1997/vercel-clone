import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { listDashboardAction } from '../../actions/app.action'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function LatestDeployments() {

  const {
    data: dashboardData,
    isLoading: isLoadingDashboardData
  } = useQuery({
    queryFn: () => listDashboardAction({}),
    queryKey: ['app-dashboard']
  })


  const deploymentsList = dashboardData?.deployments || []

  return (
    <div className='bg-secondary-foreground rounded-lg hover:shadow  px-6 py-6'>

      <div className='mb-4'>
        <h2 className='font-semibold text-lg'>Latest Deployments</h2>
        <p>Check out your latest deployments</p>
      </div>

      <div className='border border-muted'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Deployment Url</TableHead>
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
              deploymentsList.map((deployment: any) => (

                <TableRow key={deployment.id}>
                  <TableCell>{deployment.projectName}</TableCell>
                  <TableCell>
                    <div>
                      <Badge className={cn('bg-muted-foreground', { "bg-red-500": deployment.status === 'Failed' })}>{deployment.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(deployment.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <a href={deployment.deploymentUrl} target="_blank" className='hover:text-primary'>{deployment.deploymentUrl}</a>
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

export default LatestDeployments