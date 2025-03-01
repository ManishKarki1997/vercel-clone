import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AddProjectSchema, EditProjectSchema } from '../schema/project.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectAction, editProjectAction } from '../actions/project.action';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Project } from '../types/project.types';

type Props = {
  onClose: () => void
  isOpen: boolean;
  project?: Project | null;
  onSuccessCallback?: (values: any) => void
}

function ManageProject({
  isOpen,
  onClose,
  project,
  onSuccessCallback
}: Props) {

  const queryClient = useQueryClient()


  const mutation = useMutation({
    mutationFn: project ? editProjectAction : createProjectAction,
    onSuccess: () => {
      toast.success(
        project ? "Project updated Successfully" :
          "Project created Successfully")

      queryClient.invalidateQueries({ queryKey: ['projects'] })

      if (project) {
        queryClient.invalidateQueries({ queryKey: ['project-detail', { slug: project?.slug }] })
      }

      onClose()
      if (onSuccessCallback) {
        onSuccessCallback(form.getValues())
      }
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.error || `Something went wrong while ${project ? 'updating' : 'creating'} the project`)
    },
  })

  const isEditMode = !!project
  const relevantFormSchema = isEditMode ? EditProjectSchema : AddProjectSchema;


  const form = useForm<z.infer<typeof relevantFormSchema>>({
    resolver: zodResolver(relevantFormSchema),
    defaultValues: {
      name: project ? project.name : "",
      description: project ? project.description : "",
      gitUrl: project ? project.gitUrl : "",
      ...(isEditMode && {
        slug: project ? project.slug : "",
      }),
      ...(isEditMode && {
        id: project ? project.id : "",
      }),
    },
  })

  console.log("form errors", form.formState.errors)
  function onSubmit(values: z.infer<typeof relevantFormSchema>) {
    mutation.mutate(values)
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Update" : "Create"} Project</DialogTitle>
        </DialogHeader>

        <div className='pt-4'>
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="name"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gitUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Git URL</FormLabel>
                      <FormControl>
                        <Input type="url"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {
                  project &&
                  <FormField
                    control={form.control}
                    // in edit mode slug will be present, but for some reason form is complaining
                    // @ts-expect-error
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input type="text"  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                }

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={6}  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex items-center gap-2 mt-6'>
                <Button type="submit">
                  {project ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default ManageProject