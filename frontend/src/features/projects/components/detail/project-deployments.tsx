import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { deployProjectAction } from '../../actions/project.action'
import { useProjectDetail } from '../../providers/project-detail-provider'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { DataTable } from '@/components/shared/data-table'
import { DeploymentListColumnActionType, DeploymentListColumns, useDeploymentListColumns } from '../deployments/deployment-list-columns'
import { Deployment } from '../../types/project.types'
import { DataTablePagination } from '@/components/shared/data-table-pagination'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { usePagination } from '@/hooks/use-pagination'
import DeploymentLogs from '../deployments/deployment-logs'

const deployments: Deployment[] = [
  {
    id: "728ed52f",
    status: "Started",
    deploymentUrl: "m@example.com",
    createdAt: new Date().toString(),
    completedAt: new Date().toString(),
    projectId: "ecommerce-template",
    userId: "user-2"
  },
  {
    id: "489e1d42",
    status: "Running",
    deploymentUrl: "example@gmail.com",
    createdAt: new Date().toString(),
    completedAt: new Date().toString(),
    projectId: "starter-template",
    userId: "user-1"
  },
]

function ProjectDeployments() {

  const [isDeploymentLogModalActive, setIsDeploymentLogModalActive] = React.useState(true)
  const [selectedDeployment, setSelectedDeployment] = React.useState(null)

  const { project } = useProjectDetail()

  const queryClient = useQueryClient()
  const { DeploymentListColumns } = useDeploymentListColumns()
  const { onPaginationChange, pagination } = usePagination();

  const onCloseDeploymentLogsModal = () => {
    setIsDeploymentLogModalActive(false)
    setSelectedDeployment(null)
  }

  const onColumnAction = React.useCallback((action: DeploymentListColumnActionType, deployment: Deployment, extra: any) => {
    if (action === "CopyDeploymentId") {
      navigator.clipboard.writeText(deployment.deploymentUrl)
      toast.success("Deployment url copied to clipboard")
    } else if (action === "Redeploy") {
      // TODO make api call to redeploy this deployment
    } else {
      // do nothing
    }
  }, [])

  const table = useReactTable({
    data: deployments,
    columns: DeploymentListColumns({
      onAction: onColumnAction
    }),
    manualPagination: true,
    // pageCount: apiPagination?.totalPages || 1,
    // rowCount: apiPagination?.totalEntities || 1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    // autoResetPageIndex: false, //turn off auto reset of pageIndex

    state: {
      pagination,
    }
  })

  const mutation = useMutation({
    mutationFn: deployProjectAction,
    onSuccess: () => {
      toast.success("Queued for deployment successfully")
      queryClient.invalidateQueries({ queryKey: ['deployment', { slug: project?.slug }] })
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.error || "Something went wrong while deploying project")
    },
  })

  const deployProject = () => {
    if (!project) return

    mutation.mutate({ slug: project.slug })
  }

  return (
    <div>

      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className='text-lg'>Deployments History</h2>
        </div>

        <Button
          variant="secondary"
          disabled={mutation.isPending || !project?.slug}
          onClick={deployProject}
        >
          <PlayIcon />
          Redeploy Latest
        </Button>
      </div>

      <div className="my-4">
        <DataTable
          table={table}
          columns={DeploymentListColumns({
            onAction: onColumnAction
          })}
        />

        <div className="w-full h-8"></div>
        <DataTablePagination table={table} />
      </div>

      {
        isDeploymentLogModalActive &&
        <DeploymentLogs
          isOpen={isDeploymentLogModalActive}
          onClose={onCloseDeploymentLogsModal}
          deployment={selectedDeployment}
        />
      }
    </div>
  )
}

export default ProjectDeployments