import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { deployProjectAction, listProjectDeploymentsAction } from '../../actions/project.action'
import { useProjectDetail } from '../../providers/project-detail-provider'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { DataTable } from '@/components/shared/data-table'
import { DeploymentListColumnActionType, DeploymentListColumns, useDeploymentListColumns } from '../deployments/deployment-list-columns'
import { DataTablePagination } from '@/components/shared/data-table-pagination'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { usePagination } from '@/hooks/use-pagination'
import DeploymentLogs from '../deployments/deployment-logs'
import { Deployment } from '../../types/deployment.types'
import DeleteDeploymentDialog from '../deployments/delete-deployment-dialog'


function ProjectDeployments() {

  const [isDeploymentLogModalActive, setIsDeploymentLogModalActive] = React.useState(false)

  const { project, isDeleteDeploymentModalOpen, selectedDeployment, setSelectedDeployment, onDeleteDeployment } = useProjectDetail()

  const queryClient = useQueryClient()
  const { DeploymentListColumns } = useDeploymentListColumns()
  const { onPaginationChange, pagination } = usePagination();

  const {
    data: deploymentsListData
  } = useQuery({
    queryKey: ['deployment', { slug: project?.slug, page: pagination.pageIndex + 1, limit: pagination.pageSize }],
    queryFn: () => listProjectDeploymentsAction({
      projectId: !project ? '' : project.id,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize
    }),
    enabled: !!project
  })

  const deployments: Deployment[] = deploymentsListData?.deployments || []


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
    } else if (action === "ViewLogs") {
      setIsDeploymentLogModalActive(true)
      setSelectedDeployment(deployment)
    } else if (action === "Delete") {
      onDeleteDeployment(deployment)
    }
  }, [onDeleteDeployment, setSelectedDeployment])

  const table = useReactTable({
    data: deployments,
    columns: DeploymentListColumns({
      onAction: onColumnAction
    }),
    manualPagination: true,
    pageCount: deploymentsListData?.totalPages || 1,
    rowCount: deploymentsListData?.totalEntities || 1,
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
      toast.success("Queued for deployment successfully", { id: "deploy-project" })
      queryClient.invalidateQueries({ queryKey: ['deployment', { slug: project?.slug }] })
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.error || "Something went wrong while deploying project", { id: "deploy-project" })
    },
  })

  const deployProject = () => {
    if (!project) return
    toast.loading("Deploying project", { id: "deploy-project" })

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
        isDeploymentLogModalActive
        && selectedDeployment
        &&
        <DeploymentLogs
          isOpen={isDeploymentLogModalActive}
          onClose={onCloseDeploymentLogsModal}
          deployment={selectedDeployment}
        />
      }

      {
        isDeleteDeploymentModalOpen &&
        selectedDeployment &&
        <DeleteDeploymentDialog />
      }
    </div>
  )
}

export default ProjectDeployments