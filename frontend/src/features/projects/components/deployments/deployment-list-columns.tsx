
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { CopyIcon, MoreHorizontal, RotateCcwIcon } from "lucide-react"
import { Deployment } from "../../types/project.types"

export type DeploymentListColumnActionType = 'CopyDeploymentId' | 'Redeploy'

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
        cell: ({ row }) => <span>{!row.original.completedAt ? "-" : new Date(row.original.completedAt).toLocaleString()}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "deploymentUrl",
        header: "Deployment Url",
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction("Redeploy", deployment)}
                >
                  <RotateCcwIcon />
                  Redeploy
                </DropdownMenuItem>
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


