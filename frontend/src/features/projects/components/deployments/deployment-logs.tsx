import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSocket } from '@/hooks/use-socket';
import React from 'react'
import { Deployment, DeploymentLog } from '../../types/deployment.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/features/app/components/empty-state';
import { NotebookIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useProjectDetail } from '../../providers/project-detail-provider';
import { listDeploymentLogsAction } from '../../actions/project.action';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  onClose: () => void
  isOpen: boolean;
  deployment: Deployment;
}

function DeploymentLogs({
  isOpen,
  onClose,
  deployment,
}: Props) {

  const { project } = useProjectDetail()
  const { socket } = useSocket()
  const queryClient = useQueryClient();
  const [deploymentLogs, setDeploymentLogs] = React.useState<DeploymentLog[]>([])

  const {
    data: deploymentLogsData,
    isLoading: isLoadingDeploymentLogs,
  } = useQuery({
    queryKey: ['deployment', "logs", { slug: deployment?.id }],
    queryFn: () => listDeploymentLogsAction({ deploymentId: deployment.id, userId: project!.userId }),
    enabled: !!deployment && !!project && deployment.status === 'Completed',
  })

  React.useEffect(() => {
    if (!deployment) return;

    if (!socket) return;

    socket.on("log", logObj => {
      const parsedDeploymentLog: DeploymentLog = JSON.parse(logObj)
      setDeploymentLogs(prev => prev.concat(parsedDeploymentLog))
      // console.log("Received log ", parsedDeploymentLog)
      if (parsedDeploymentLog?.isCompleted) {
        if (parsedDeploymentLog?.hasError) {
          toast.error(`Project deployment failed`)
        } else {
          toast.success(`Project deployed successfully`)
        }

        queryClient.invalidateQueries({ queryKey: ['deployment', { slug: project?.slug }] })

      }
    })


    // socket.emit("subscribe", `logs:${deployment.id}`)
    socket.emit("subscribe", `logs:${deployment.projectId}`)

    return () => {
      socket.off("log")
      // socket.emit("unsubscribe", `logs:${deployment.id}`)
      socket.emit("unsubscribe", `logs:${deployment.projectId}`)
    }

  }, [deployment, project?.slug, queryClient, socket])

  React.useEffect(() => {
    if (deployment && deployment.status === "Completed" && deploymentLogsData) {
      setDeploymentLogs(deploymentLogsData)
    }
  }, [deployment, deploymentLogsData])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[75%] max-w-[1000px]'>
        <DialogHeader className='h-12'>
          <DialogTitle className='gap-2 flex items-center '>
            <p>View Deployment Logs</p>
            <Badge variant="secondary" className={cn("font-normal", deployment.status === "Completed" ? "bg-green-500" : "bg-blue-500")}>
              {deployment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className=' h-[700px] '>

          <div className="space-y-0">


            {
              isLoadingDeploymentLogs && deployment.status === 'Completed' &&
              <div className="space-y-2">
                {
                  Array.from(Array(10).keys()).map(idx => (
                    <Skeleton key={idx} className='h-10 w-full rounded' />
                  ))
                }
              </div>
            }

            {
              !deploymentLogs.length &&
              <EmptyState className='text-center flex flex-col items-center shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg'>
                <NotebookIcon />
                <EmptyState.Header>
                  No Logs Available
                </EmptyState.Header>

              </EmptyState>
            }
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead >Timestamp</TableHead>
                  <TableHead>Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {
                  deploymentLogs.length > 0 &&
                  deploymentLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell width={"250px"} className='text-base text-muted-foreground font-mono'>{log?.timestamp ? new Date(log?.timestamp).toLocaleString() : log?.date ? new Date(log?.date).toLocaleDateString() : ""}</TableCell>
                      <TableCell className={cn(' text-base text-foreground font-medium', { 'text-red-500': log.type === "error", 'text-green-500': log.type === "success" })}>{log.log}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default DeploymentLogs