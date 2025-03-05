import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { PlusIcon, TreesIcon, XIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { updateProjectSettingsAction } from '../../actions/project.action'
import { DEFAULT_PROJECT_SETTINGS } from '../../constants/project-constants'
import { useProjectDetail } from '../../providers/project-detail-provider'
import { SettingsSchema } from '../../schema/project.schema'



const DEFAULT_REQUIRED_ENV_NAMES = DEFAULT_PROJECT_SETTINGS.map(env => env.name)

function ProjectSettings() {

  const { project } = useProjectDetail()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      userId: user?.id || "",
      projectId: project?.id || "",
      environmentVariables: [
        {
          name: "BUILD_COMMAND",
          value: "npm run build",
          userId: user?.id || "",
          projectId: project?.id || "",
        },
        {
          name: "INSTALL_COMMAND",
          value: "npm install",
          userId: user?.id || "",
          projectId: project?.id || "",
        },
        {
          name: "OUTPUT_FOLDER_NAME",
          value: "dist",
          userId: user?.id || "",
          projectId: project?.id || "",
        },
      ]
    },
  })
  console.log("form errors ", form.formState.errors)
  const queryClient = useQueryClient()

  const updateSettingsMutation = useMutation({
    mutationFn: updateProjectSettingsAction,
    onSuccess: () => {
      toast.success("Project settings saved successfully", { id: "updating-project-settings" })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project-detail', { slug: project?.slug }] })
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data?.message || "Something went wrong while updating project settings", { id: "updating-project-settings" })
    },
  })

  const { fields: envFields, append: appendEnv, remove: removeEnv } = useFieldArray({
    control: form.control,
    name: "environmentVariables",
  });

  function onSubmit(values: z.infer<typeof SettingsSchema>) {
    console.log("onsubmit", values, project?.id, user?.id)
    if (!project?.id) return;
    if (!user?.id) return;

    const environmentVariablesPayload = values.environmentVariables.map(env => ({
      ...env,
      projectId: project?.id,
      userId: user?.id
    }))

    const payload = {
      projectId: project?.id,
      userId: user?.id,
      environmentVariables: environmentVariablesPayload
    }

    toast.loading("Updating project settings", { id: "updating-project-settings" })
    updateSettingsMutation.mutate(payload)
    console.log(values)
  }



  return (
    <div className='pt-8'>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


            <div className='w-full max-w-4xl '>

              <div className="flex items-center gap-2 mb-6">
                <TreesIcon />
                <h2 className='font-medium text-lg'>Environment Variables</h2>
              </div>

              <div className='w-full space-y-6'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>

                    {
                      envFields.map((field, idx) => (
                        <TableRow
                          className='border-none'
                          key={field.id}
                        >
                          <TableCell width={"40%"} className="font-medium py-2">
                            <FormField
                              control={form.control}
                              name={`environmentVariables.${idx}.name`}
                              render={({ field }) => (
                                <FormItem className='flex-1'>
                                  <FormControl>
                                    <Input
                                      disabled={DEFAULT_REQUIRED_ENV_NAMES.includes(form.getValues(`environmentVariables.${idx}.name`))}
                                      placeholder="e.g. DATABASE_URL"
                                      {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell width={"40%"} className=' py-2'>
                            <FormField
                              control={form.control}
                              name={`environmentVariables.${idx}.value`}
                              render={({ field }) => (
                                <FormItem className='flex-1'>
                                  <FormControl>
                                    <Input placeholder="e.g. postgresql://[user[:password]@][netloc][:port][/dbname]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell width={"20%"} className=' py-2'>
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger
                                  className='border border-muted-foreground/20 hover:border-muted-foreground/50 rounded h-7 w-7 flex items-center justify-center'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    appendEnv({
                                      name: "",
                                      value: "",
                                      projectId: project!.id,
                                      userId: user!.id,
                                    })
                                  }}
                                >

                                  <PlusIcon size={20} />

                                </TooltipTrigger>

                                <TooltipContent>
                                  Add Variable
                                </TooltipContent>

                              </Tooltip>
                              {
                                !DEFAULT_REQUIRED_ENV_NAMES.includes(form.getValues(`environmentVariables.${idx}.name`)) &&
                                <Tooltip>
                                  <TooltipTrigger
                                    className='border border-muted-foreground/20 hover:border-muted-foreground/50 rounded h-7 w-7 flex items-center justify-center'
                                    disabled={DEFAULT_REQUIRED_ENV_NAMES.includes(form.getValues(`environmentVariables.${idx}.name`))}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeEnv(idx)
                                    }}
                                  >
                                    <XIcon size={18} className='text-red-500' />
                                  </TooltipTrigger>

                                  <TooltipContent>
                                    {
                                      DEFAULT_REQUIRED_ENV_NAMES.includes(form.getValues(`environmentVariables.${idx}.name`))
                                        ? "Cannot delete required environment variable"
                                        : "Delete Variable"
                                    }

                                  </TooltipContent>
                                </Tooltip>
                              }
                            </div>
                          </TableCell>
                        </TableRow>

                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="my-4">
              <Button type="submit">Save</Button>
            </div>


          </form>
        </Form>
      </div>
    </div>
  )
}

export default ProjectSettings