import { useForm } from "react-hook-form"
import { UserUpdateInput, userUpdateSchema } from "@acme/validations/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserAllResponse } from "@acme/api/src/router/user"
import { trpc } from "@/utils/trpc"
import { useToast } from "@/components/ui/use-toast"
import ModalForm from "../Modal"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type EditUserFormProps = {
  user: UserAllResponse[number]
  open: boolean
  setIsOpen: (open: boolean) => void
}

export default function EditUserForm({ user, open, setIsOpen }: EditUserFormProps) {
  const roleQuery = trpc.role.all.useQuery()
  const studentQuery = trpc.student.all.useQuery()

  const { toast } = useToast()

  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      roles: user.roles.map(role => role.id),
      children: user.children.map(child => child.id),
    }
  })

  const ctx = trpc.useContext()

  const { mutate } = trpc.user.update.useMutation({
    onSuccess: async () => {
      await ctx.user.all.invalidate();

      setIsOpen(false)
      toast({
        title: "User updated",
        description: "User updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  function onSubmit(data: UserUpdateInput) {
    mutate(data)
  }

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="Edit User"
      open={open}
      setIsOpen={setIsOpen}
      showCreateButton={false}
      isLoading={roleQuery.isLoading}
    >
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roles"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Roles</FormLabel>
              <FormDescription>Select the roles to assign to this user.</FormDescription>
            </div>
            {roleQuery.data?.map((role) => (
              <FormField
                key={role.id}
                control={form.control}
                name="roles"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={role.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(role.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, role.id])
                              : field.onChange(
                                field.value?.filter(
                                  (value) => value !== role.id
                                )
                              )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {role.name}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="children"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Children</FormLabel>
              <FormDescription>This user will be able to see these children and their logs.</FormDescription>
            </div>
            {studentQuery.data?.map((student) => (
              <FormField
                key={student.id}
                control={form.control}
                name="children"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={student.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(student.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, student.id])
                              : field.onChange(
                                field.value?.filter(
                                  (value) => value !== student.id
                                )
                              )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {student.firstName} {student.lastName}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

    </ModalForm>
  )
}
