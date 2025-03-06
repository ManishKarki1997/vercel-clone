import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSocket } from '@/hooks/use-socket';
import React from 'react'
import { Deployment, DeploymentLog } from '../../types/deployment.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/features/app/components/empty-state';
import { NotebookIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useProjectDetail } from '../../providers/project-detail-provider';

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

  }, [deployment, socket])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[75%] max-w-[1000px]'>
        <DialogHeader className='h-12'>
          <DialogTitle>View Deployment Logs</DialogTitle>
        </DialogHeader>

        <ScrollArea className=' h-[700px] '>

          <div className="space-y-2">


            {
              !deploymentLogs.length &&
              <EmptyState className='text-center flex flex-col items-center shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg'>
                <NotebookIcon />
                <EmptyState.Header>
                  No Logs Available
                </EmptyState.Header>

              </EmptyState>
            }

            {
              deploymentLogs.map((log, idx) => (
                <div key={idx} className='flex items-start gap-4'>
                  <p className='text-base text-muted-foreground font-mono'>{new Date(log.date).toLocaleString()}</p>
                  <p className={cn(' text-base text-foreground font-medium', { 'text-red-500': log.type === "error", 'text-green-500': log.type === "success" })}>{log.log}</p>
                </div>
              ))
            }
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default DeploymentLogs