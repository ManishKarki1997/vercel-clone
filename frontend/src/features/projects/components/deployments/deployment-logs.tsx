import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSocket } from '@/hooks/use-socket';
import React from 'react'
import { DeploymentLog } from '../../types/deployment.types';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  onClose: () => void
  isOpen: boolean;
  deployment?: any;
}

function DeploymentLogs({
  isOpen,
  onClose,
  deployment,
}: Props) {

  const { socket } = useSocket()
  const [deploymentLogs, setDeploymentLogs] = React.useState<DeploymentLog[]>([])

  React.useEffect(() => {
    // if(!deployment) return;

    if (!socket) return;

    socket.on("log", logObj => {
      const parsedDeploymentLog: DeploymentLog = JSON.parse(logObj)
      setDeploymentLogs(prev => prev.concat(parsedDeploymentLog))
      console.log("Received log ", logObj)
    })

    socket.emit("subscribe", "logs:p1")

    return () => {
      socket.off("log")
    }

  }, [deployment, socket])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[75%] max-w-[1000px]'>
        <DialogHeader className='h-12'>
          <DialogTitle>View Deployment Logs</DialogTitle>
        </DialogHeader>

        <ScrollArea className='pt-4 h-[700px] '>

          <div className="space-y-2">
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, officiis. Rem, sapiente unde. Repudiandae sapiente rem reprehenderit tempora et suscipit. */}
            {
              deploymentLogs.map((log, idx) => (
                <div key={idx} className='flex items-start gap-4'>
                  <p className='text-base text-muted-foreground font-mono'>{new Date(log.date).toLocaleString()}</p>
                  <p className=' text-base text-foreground font-medium'>{log.log}</p>
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