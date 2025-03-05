import AppContainer from '@/features/app/components/app-container'
import React from 'react'
import ProjectDetailHeader from '../components/detail/project-detail-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoIcon, PlayIcon, SettingsIcon } from 'lucide-react'
import ProjectBasicInfo from '../components/detail/project-basic-info'
import { ProjectDetailProvider, useProjectDetail } from '../providers/project-detail-provider'
import ProjectDeployments from '../components/detail/project-deployments'
import ProjectSettings from '../components/detail/project-settings'
import { PROJECT_DETAIL_TABS } from '../constants/project-constants'
import { ProjectDetailTabValue } from '../types/project.types'

function ProjectDetail() {

  const {
    activeTab,
    setActiveTab
  } = useProjectDetail()

  return (
    <div className='py-4 bg-background'>
      <AppContainer className=''>
        <ProjectDetailHeader />

        <Tabs
          value={activeTab}
          onValueChange={(_value) => setActiveTab(_value as ProjectDetailTabValue)}
          className=" mt-12">
          <TabsList className='h-10'>
            {
              PROJECT_DETAIL_TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className='px-8 py-2 gap-2'>
                  {tab.icon}
                  {tab.name}
                </TabsTrigger>

              ))
            }
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