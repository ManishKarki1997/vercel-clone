import { Button } from '@/components/ui/button'
import { ArchiveIcon, PencilLineIcon } from 'lucide-react'
import React from 'react'
import { useProjectDetail } from '../../providers/project-detail-provider'
import ManageProject from '../manage-project'

function ProjectDetailHeader() {

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = React.useState(false)

  const {
    project
  } = useProjectDetail()


  const onCloseAddProject = () => {
    setIsEditProjectModalOpen(false)
  }


  if (!project) return null

  return (
    <div>
      <div className='flex items-start justify-between gap-2 flex-wrap'>
        <div>
          <h2 className='font-medium text-xl'>{project.name}</h2>
          <p className='text-muted-foreground text-sm'>{new Date(project.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsEditProjectModalOpen(true)}>
            <PencilLineIcon />
            Edit
          </Button>

          <Button variant="outline" className='text-red-500'>
            <ArchiveIcon />
            Archive
          </Button>

        </div>

        {
          isEditProjectModalOpen && project &&
          <ManageProject
            isOpen={isEditProjectModalOpen}
            onClose={onCloseAddProject}
            project={project}
          />
        }

      </div>
    </div>
  )
}

export default ProjectDetailHeader