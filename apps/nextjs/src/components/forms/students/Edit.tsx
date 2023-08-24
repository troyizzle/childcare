import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/utils/trpc"
import { StudentUpdateInput, studentUpdateSchema } from "@acme/validations/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import ModalForm from "../Modal"

type EditStudentFormProps = {
  studentId: string
  open: boolean
  setIsOpen: (open: boolean) => void
}

export default function EditStudentForm({ studentId, open, setIsOpen }: EditStudentFormProps) {
  const ctx = trpc.useContext()
  const { toast } = useToast()
  const studentQuery = trpc.student.byId.useQuery({
    id: studentId,
  })

  const form = useForm<StudentUpdateInput>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      firstName: studentQuery.data?.firstName,
      lastName: studentQuery.data?.lastName,
      contactInfos: studentQuery.data?.contactInfos,
    }
  })

  const { fields: contactInfoFields, insert, replace } = useFieldArray({
    control: form.control,
    name: "contactInfos"
  })

  const { mutate } = trpc.student.update.useMutation({
    onSuccess: async () => {
      await ctx.student.all.invalidate()

      setIsOpen(false)
      toast({
        title: "Student updated",
        description: "Student updated successfully",
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

  function onSubmit(data: StudentUpdateInput) {
    mutate(data)
  }

  useEffect(() => {
    if (!studentQuery.data) return

    form.reset(studentQuery.data)
  }, [studentQuery.data])

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="Edit Student"
      open={open}
      setIsOpen={setIsOpen}
      showCreateButton={false}
    >
      {studentQuery.isLoading && <Icons.spinner className="animate-spin h-5 w-5 text-blue-500" />}
      {studentQuery.data && (
        <>
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

          <div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  insert(contactInfoFields.length + 1, {
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    relationship: ""
                  })
                }}
              >
                <span className="text-sm">Add Contact Info</span>
                <Icons.add className="h-5 w-5" />
              </Button>
            </div>
            {contactInfoFields.map((contactInfo, index) => (
              <div key={contactInfo.id}>
                <FormField
                  control={form.control}
                  name={`contactInfos.${index}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactInfos.${index}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactInfos.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactInfos.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contactInfos.${index}.relationship`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </ModalForm>
  )
}
