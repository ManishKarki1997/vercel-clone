import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AddProjectSchema } from '../schema/project.schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectAction } from '../actions/project.action';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

type Props = {
  onClose: () => void
  isOpen: boolean;
}

function AddProject({
  isOpen,
  onClose
}: Props) {

  const queryClient = useQueryClient()


  const mutation = useMutation({
    mutationFn: createProjectAction,
    onSuccess: () => {
      toast.success("Project created Successfully")

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      onClose()
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.message || "Something went wrong while creating the project")
    },
  })

  const form = useForm<z.infer<typeof AddProjectSchema>>({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      name: "",
      description: ""
    },
  })


  function onSubmit(values: z.infer<typeof AddProjectSchema>) {
    mutation.mutate(values)
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
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
                  Create
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

export default AddProject