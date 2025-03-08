import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import React from 'react'
import { useProjectDetail } from '../../providers/project-detail-provider';

type Props = {
  onCancel: () => void;
  onDelete: () => void;
  isOpen: boolean;
}

function DeleteDeploymentDialog() {

  const { isDeleteDeploymentModalOpen, onCancelDeleteDeployment, handleDeleteDeployment, isDeletingDeployment, } = useProjectDetail()


  return (
    <AlertDialog open={isDeleteDeploymentModalOpen} onOpenChange={onCancelDeleteDeployment}>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this deployment record. The deployed files won't be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelDeleteDeployment}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeletingDeployment} onClick={handleDeleteDeployment}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDeploymentDialog