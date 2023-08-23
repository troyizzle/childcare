import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import ModalForm from "../Modal";
import { useToast } from "@/components/ui/use-toast";
import { ClassroomUpdateInput, classroomUpdateSchema } from "@acme/validations/classroom";
import { Classroom } from "@acme/db";
import { Checkbox } from "@/components/ui/checkbox";

type EditClassRoomFormProps = {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  classroom: Classroom
}

export default function EditClassRoomForm({ classroom, open, setIsOpen }: EditClassRoomFormProps) {
  const ctx = trpc.useContext();

  const { toast } = useToast();

  const classroomQuery = trpc.classroom.byId.useQuery({
    id: classroom.id
  })

  const userQuery = trpc.user.all.useQuery()

  const studentQuery = trpc.student.all.useQuery()

  const { mutate } = trpc.classroom.update.useMutation({
    onSuccess: async () => {
      await ctx.classroom.all.invalidate();
      setIsOpen(false)
      toast({
        title: "Class updated",
        description: "Class updated successfully",
      })
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: "Error",
        description: "Error creating class",
        variant: "destructive"
      })
    }
  })

  function onSubmit(data: ClassroomUpdateInput) {
    mutate(data)
  }

  const form = useForm<ClassroomUpdateInput>({
    resolver: zodResolver(classroomUpdateSchema),
    defaultValues: {
      ...classroom,
      teachers: classroomQuery.data?.teachers.map((teacher) => teacher.id) || [],
      students: classroomQuery.data?.students.map((student) => student.id) || []
    }
  })

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="Edit Classroom"
      open={open}
      setIsOpen={setIsOpen}
      showCreateButton={false}
      isLoading={classroomQuery.isFetching || userQuery.isFetching}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teachers"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Teachers</FormLabel>
              <FormDescription>
                Select the teachers in this classroom, this will give them permission to view the students in this classroom.
              </FormDescription>
            </div>
            {userQuery.data?.map((teacher) => (
              <FormField
                key={teacher.id}
                control={form.control}
                name="teachers"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={teacher.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(teacher.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, teacher.id])
                              : field.onChange(
                                field.value?.filter(
                                  (value) => value !== teacher.id
                                )
                              )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {teacher.firstName} {teacher.lastName}
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
        name="students"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Students</FormLabel>
              <FormDescription>
                Select the students in this classroom, this will allow the teachers to be able to see them.
              </FormDescription>
            </div>
            {studentQuery.data?.map((student) => (
              <FormField
                key={student.id}
                control={form.control}
                name="students"
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
