import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { ActionNewInput, actionNewSchema } from "@acme/validations/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ModalForm from "../Modal";

export default function NewActionForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();
  const { toast } = useToast();

  const { mutate } = trpc.action.create.useMutation({
    onSuccess: async () => {
      setIsOpen(false)
      await ctx.invalidate()

      toast({
        title: "Action created",
        description: "Your action has been created"
      })
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    }
  })

  function onSubmit(data: ActionNewInput) {
    mutate(data)
  }

  const form = useForm<ActionNewInput>({
    resolver: zodResolver(actionNewSchema)
  })

  return (
    <ModalForm
      modalTitle="New Action"
      modalDescription="This action will be available as an option for the student log"
      form={form}
      onSubmit={onSubmit}
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
