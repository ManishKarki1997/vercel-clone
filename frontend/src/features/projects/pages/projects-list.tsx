import React from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/config/pagination';
import AppContainer from '@/features/app/components/app-container';
import AppPageHeader from '@/features/app/components/app-page-header';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listProjectsAction } from '../actions/project.action';
import ManageProject from '../components/manage-project';
import ProjectCard from '../components/project-card';
import { ProjectPage } from '../types/project.types';
import ProjectsListSkeleton from '../components/skeletons/projects-list-skeleton';
import EmptyState from '@/features/app/components/empty-state';
import { NetworkIcon } from 'lucide-react';


function ProjectsList() {

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = React.useState(false)

  const [loadMoreElementRef, { entry }] = useIntersectionObserver();
  const isLoadMoreElementVisible = entry && entry.isIntersecting;

  const onCloseAddProject = () => {
    setIsAddProjectModalOpen(false)
  }



  const {
    data: projectsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => listProjectsAction({ page: pageParam || Pagination.INITIAL_PAGE, limit: Pagination.LIMIT * 2 }),
    initialPageParam: Pagination.INITIAL_PAGE,
    getNextPageParam: (lastPage,) => {
      if (!lastPage.hasNextPage) return undefined
      return lastPage.page + 1
    },
  })

  const projectPages: ProjectPage[] = (projectsData?.pages || []) as any
  const hasProjects = projectPages?.some(project => project.projects.length > 0)

  console.log("projectsData", projectsData, hasNextPage)

  React.useEffect(() => {
    if (!isLoadMoreElementVisible) return;
    if (isFetching || isFetchingNextPage) return
    if (!hasNextPage) return

    fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoadMoreElementVisible])

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
          {
            hasProjects &&
            <Button onClick={() => setIsAddProjectModalOpen(true)}>New Project</Button>
          }
        </AppPageHeader.Actions>

      </AppPageHeader>

      <AppContainer className="mt-6">

        {
          !isFetching && !hasProjects &&
          <EmptyState className='my-8'>
            <EmptyState.Header className='text-center flex flex-col items-center gap-4'>
              <NetworkIcon size={32} />
              <div>
                <h2 className='text-lg font-medium'>No Projects Found</h2>
                <p className='text-muted-foreground'>You have not created any projects yet.</p>
              </div>
            </EmptyState.Header>

            <EmptyState.Actions>
              <Button onClick={() => setIsAddProjectModalOpen(true)}>Create a New Project</Button>
            </EmptyState.Actions>
          </EmptyState>
        }


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
          {
            isFetching &&
            !isFetchingNextPage &&
            <ProjectsListSkeleton />
          }

          {

            !isFetching &&
            projectPages
              .map((projectPage, idx) => (
                <React.Fragment key={idx}>
                  {
                    projectPage.projects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  }
                </React.Fragment>
              ))
          }

          {
            isFetchingNextPage &&
            <ProjectsListSkeleton />
          }
        </div>


        <div
          ref={loadMoreElementRef}
          className="my-4 flex items-center justify-center bg-red-500 h-100"
        >
          {/* <Button
            ref={loadMoreElementRef}
            onClick={() => fetchNextPage()}
          >
            Next Page
          </Button> */}
        </div>

      </AppContainer>

      {
        isAddProjectModalOpen &&
        <ManageProject isOpen={isAddProjectModalOpen} onClose={onCloseAddProject} />
      }
    </div>
  )
}

export default ProjectsList