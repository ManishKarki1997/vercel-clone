import moment from 'moment'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CopyIcon, DeleteIcon, MoreHorizontal, NotebookIcon, RotateCcwIcon, TrashIcon } from "lucide-react"
import { Deployment } from '../../types/deployment.types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type DeploymentListColumnActionType = 'CopyDeploymentId' | 'ViewLogs' | 'Redeploy' | "Delete"

type DeploymentListColumnsProps = {
  onAction: (action: DeploymentListColumnActionType, row: Deployment, extra?: any) => void;
}

export const useDeploymentListColumns = () => {
  const DeploymentListColumns = ({
    onAction
  }: DeploymentListColumnsProps): ColumnDef<Deployment>[] => [
      {
        accessorKey: "projectId",
        header: "Project Id",
      },
      {
        accessorKey: "createdAt",
        header: "Started At",
        cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleString()}</span>,
      },
      {
        accessorKey: "completedAt",
        header: "Completed At",
        cell: ({ row }) => <p>
          <span className='font-medium'>
            {
              !row.original.completedAt || !row.original.createdAt ? "" :
                <>
                  {!row.original.completedAt ? "" : moment(row.original.completedAt).diff(moment(row.original.createdAt), "minutes")}m
                  {(!row.original.completedAt || !row.original.createdAt) ? "" : moment(row.original.completedAt).diff(moment(row.original.createdAt), "seconds")}
                  s
                </>
            }
          </span>
          <br />
          <span>{(!row.original.completedAt) ? "-" : new Date(row.original.completedAt).toLocaleString()}</span>
        </p>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div>
            <Badge className={cn('bg-muted-foreground', { "bg-red-500": row.original.status === 'Failed' })}>{row.original.status}</Badge>
          </div>
        )
      },
      {
        accessorKey: "deploymentUrl",
        header: "Deployment Url",
        cell: ({ row }) => (
          <div>
            <a className="font-medium hover:text-primary" href={row.original.deploymentUrl} target="_blank">{row.original.deploymentUrl}</a>
          </div>
        )
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const deployment = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onAction("CopyDeploymentId", deployment)}
                // onClick={() => navigator.clipboard.writeText(deployment.id)}
                >
                  <CopyIcon />
                  Copy Deployment Url
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onAction("ViewLogs", deployment)}
                // onClick={() => navigator.clipboard.writeText(deployment.id)}
                >
                  <NotebookIcon />
                  View Logs
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onAction("Delete", deployment)}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>

                {/* <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction("Redeploy", deployment)}
                >
                  <RotateCcwIcon />
                  Redeploy
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  return {
    DeploymentListColumns
  }
}


