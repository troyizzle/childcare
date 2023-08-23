import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import ModalForm from "../Modal";
import { useToast } from "@/components/ui/use-toast";
import { classroomNewSchema, ClassroomCreateInput } from "@acme/validations/classroom";

export default function NewClassRoomForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();
  const { toast } = useToast();

  const { mutate } = trpc.classroom.create.useMutation({
    onSuccess: async () => {
      await ctx.classroom.all.invalidate();
      setIsOpen(false)
      toast({
        title: "Class created",
        description: "Class created successfully",
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

  function onSubmit(data: ClassroomCreateInput) {
    mutate(data)
  }

  const form = useForm<ClassroomCreateInput>({
    resolver: zodResolver(classroomNewSchema)
  })

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Classroom"
      open={open}
      setIsOpen={setIsOpen}
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
    </ModalForm>
  )
}
