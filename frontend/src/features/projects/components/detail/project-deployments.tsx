import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { deployProjectAction } from '../../actions/project.action'
import { useProjectDetail } from '../../providers/project-detail-provider'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

function ProjectDeployments() {

  const { project } = useProjectDetail()

  const queryClient = useQueryClient()

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
          Deploy
        </Button>
      </div>

    </div>
  )
}

export default ProjectDeployments