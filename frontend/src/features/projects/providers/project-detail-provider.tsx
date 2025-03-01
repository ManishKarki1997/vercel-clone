import { useQuery } from "@tanstack/react-query";
import React from "react";
import { projectDetailAction } from "../actions/project.action";
import { useParams, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { Project } from "../types/project.types";

export const ProjectDetailContext = React.createContext<ProjectDetailContextType>({
  project: null,
  isLoading: true,
  isFetching: true,
  error: null
})

type ProjectDetailContextType = {
  project: Project | null;
  isLoading: boolean;
  isFetching: boolean;
  error: AxiosError | null;
}

export const ProjectDetailProvider = ({ children }: { children: React.ReactNode }) => {


  const [searchParams] = useSearchParams()
  // const { id } = useParams()
  const slug = searchParams.get("slug")

  const {
    data: project,
    isFetching,
    isLoading,
    error
  } = useQuery({
    queryFn: () => projectDetailAction({ slug: slug! }),
    queryKey: ['project-detail', { slug }],
    enabled: !!slug
  })


  return <ProjectDetailContext.Provider
    value={{
      project: (project as Project) || null,
      isFetching,
      isLoading,
      error: (error as AxiosError) || null
    }}>
    {children}
  </ProjectDetailContext.Provider>
}

export const useProjectDetail = () => {
  const ctx = React.useContext(ProjectDetailContext)

  if (!ctx) {
    throw new Error("useProjectDetail must be used within a ProjectDetailProvider")
  }
  return ctx
}