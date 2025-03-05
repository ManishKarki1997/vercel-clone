import AppContainer from '@/features/app/components/app-container'
import React from 'react'
import ProjectDetailHeader from '../components/detail/project-detail-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoIcon, PlayIcon, SettingsIcon } from 'lucide-react'
import ProjectBasicInfo from '../components/detail/project-basic-info'
import { ProjectDetailProvider } from '../providers/project-detail-provider'
import ProjectDeployments from '../components/detail/project-deployments'
import ProjectSettings from '../components/detail/project-settings'

function ProjectDetail() {
  return (
    <div className='py-4 bg-background'>
      <AppContainer className=''>
        <ProjectDetailHeader />

        <Tabs defaultValue="settings" className=" mt-12">
          <TabsList className='h-10'>
            <TabsTrigger value="details" className='px-8 py-2 gap-2'>
              <InfoIcon size={18} />
              Details
            </TabsTrigger>
            <TabsTrigger value="deployments" className='px-8 py-2 gap-2'>
              <PlayIcon size={18} />
              Deployments
            </TabsTrigger>
            <TabsTrigger value="settings" className='px-8 py-2 gap-2'>
              <SettingsIcon size={18} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className='py-4'>
            <ProjectBasicInfo />
          </TabsContent>

          <TabsContent value="deployments" className='py-4'>
            <ProjectDeployments />
          </TabsContent>

          <TabsContent value="settings" className='py-4'>
            <ProjectSettings />
          </TabsContent>

        </Tabs>


      </AppContainer>
    </div>
  )
}

function ProjectDetailRoot() {
  return (
    <ProjectDetailProvider>
      <ProjectDetail />
    </ProjectDetailProvider>
  )
}

export default ProjectDetailRoot