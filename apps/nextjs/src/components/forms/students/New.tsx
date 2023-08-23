import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentNewInput, studentNewSchema } from "@acme/validations/student";
import ModalForm from "../Modal";
import { useToast } from "@/components/ui/use-toast";

export default function NewStudentForm() {
  const [open, setIsOpen] = useState(false);
  const ctx = trpc.useContext();
  const { toast } = useToast();

  const { mutate } = trpc.student.create.useMutation({
    onSuccess: async () => {
      await ctx.student.all.invalidate();
      setIsOpen(false)
    },
    onError: (error) => {
      console.log("firing toaster")
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  function onSubmit(data: StudentNewInput) {
    mutate(data)
  }

  const form = useForm<StudentNewInput>({
    resolver: zodResolver(studentNewSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: new Date(),
    }
  })

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Student"
      open={open}
      setIsOpen={setIsOpen}
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
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                      if (!date) return
                      field.onChange(date)
                    }
                  }
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

    </ModalForm>
  )
}
