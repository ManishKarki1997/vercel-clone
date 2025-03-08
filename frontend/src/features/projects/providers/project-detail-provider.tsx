import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteDeploymentAction, projectDetailAction } from "../actions/project.action";
import { useParams, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { Project, ProjectDetailTabValue } from "../types/project.types";
import { Deployment } from "../types/deployment.types";
import { toast } from "sonner";

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
  activeTab: ProjectDetailTabValue;
  setActiveTab: (tab: ProjectDetailTabValue) => void;
  isDeleteDeploymentModalOpen: boolean;
  onCancelDeleteDeployment: () => void;
  onDeleteDeployment: (deployment: Deployment) => void;
  selectedDeployment: Deployment | null;
  setSelectedDeployment: (deployment: Deployment | null) => void;
  handleDeleteDeployment: () => void;
  isDeletingDeployment: boolean;
}

export const ProjectDetailProvider = ({ children }: { children: React.ReactNode }) => {

  const [activeTab, setActiveTab] = React.useState<ProjectDetailTabValue>('details')
  const [selectedDeployment, setSelectedDeployment] = React.useState<Deployment | null>(null)
  const [isDeleteDeploymentModalOpen, setIsDeleteDeploymentModalOpen] = React.useState(false)

  const [searchParams] = useSearchParams()
  // const { id } = useParams()
  const slug = searchParams.get("slug")
  const queryClient = useQueryClient()

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

  const deleteDeploymentMutation = useMutation({
    mutationFn: deleteDeploymentAction,
    onSuccess: () => {
      toast.success("Deployment deleted successfully", { id: "delete-deployment" })
      queryClient.invalidateQueries({ queryKey: ['deployment', { slug: project?.slug }] })
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.message || "Something went wrong while logging in", { id: "delete-deployment" })
    },
  })

  const onCancelDeleteDeployment = () => {
    setIsDeleteDeploymentModalOpen(false)
  }

  const onDeleteDeployment = (deployment: Deployment) => {
    setSelectedDeployment(deployment)
    setIsDeleteDeploymentModalOpen(true)
  }

  const handleDeleteDeployment = () => {
    if (!selectedDeployment) return;

    toast.loading("Deleting deployment", { id: "delete-deployment" })
    deleteDeploymentMutation.mutate({
      deploymentId: selectedDeployment?.id,
      userId: selectedDeployment.userId
    })
  }

  return <ProjectDetailContext.Provider
    value={{
      project: (project as Project) || null,
      isFetching,
      isLoading,
      error: (error as AxiosError) || null,
      activeTab,
      setActiveTab,
      selectedDeployment,
      setSelectedDeployment,
      isDeleteDeploymentModalOpen,
      onCancelDeleteDeployment,
      onDeleteDeployment,
      handleDeleteDeployment,
      isDeletingDeployment: deleteDeploymentMutation.isPending
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