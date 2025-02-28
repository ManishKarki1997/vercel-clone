import React from 'react'
import ProjectCard from '../components/project-card'
import AppPageHeader from '@/features/app/components/app-page-header'
import { Button } from '@/components/ui/button'
import AppContainer from '@/features/app/components/app-container'
import AddProject from '../components/add-project'

function ProjectsList() {

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = React.useState(false)

  const onCloseAddProject = () => {
    setIsAddProjectModalOpen(false)
  }

  return (
    <div>
      <AppPageHeader>

        <AppPageHeader.Header>
          <div>
            <h2 className='text-xl font-medium'>Projects</h2>
            <p>Manage your projects</p>
          </div>
        </AppPageHeader.Header>

        <AppPageHeader.Actions>
          <Button onClick={() => setIsAddProjectModalOpen(true)}>New Project</Button>
        </AppPageHeader.Actions>

      </AppPageHeader>

      <AppContainer className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {
            Array.from(Array(8).keys()).map(project => (
              <ProjectCard key={project} />
            ))
          }
        </div>
      </AppContainer>

      {
        isAddProjectModalOpen &&
        <AddProject isOpen={isAddProjectModalOpen} onClose={onCloseAddProject} />
      }
    </div>
  )
}

export default ProjectsList