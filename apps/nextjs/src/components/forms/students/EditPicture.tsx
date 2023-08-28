import { FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/utils/trpc"
import { StudentProfilePictureInput, studentProfilePictureSchema } from "@acme/validations/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import ModalForm from "../Modal"
import AvatarEditor from "react-avatar-editor"
import { useUploadThing } from "@/utils/uploadthing"

type EditStudentFormProps = {
  studentId: string
  open: boolean
  setIsOpen: (open: boolean) => void
}

export default function EditStudentPictureForm({ studentId, open, setIsOpen }: EditStudentFormProps) {
  const [image, setImage] = useState<File | null>(null)
  const editor = useRef<AvatarEditor>(null)

  const ctx = trpc.useContext()
  const { toast } = useToast()

  const form = useForm<StudentProfilePictureInput>({
    resolver: zodResolver(studentProfilePictureSchema),
    defaultValues: {
      id: studentId
    }
  })

  const { mutate } = trpc.student.profilePicture.useMutation({
    onSuccess: async () => {
      setIsOpen(false)

      toast({
        title: "Student picture updated",
        description: "Student picture updated successfully",
      })

      await ctx.student.all.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      if (!data) return;

      if (!data[0]?.url) {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
        return
      }

      mutate({
        id: studentId,
        profilePicture: data[0].url
      })
    },
    onUploadError: () => {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    }
  })

  async function onSubmit() {
    if (editor.current) {
      const canvas = editor.current.getImageScaledToCanvas()

      await new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          await startUpload([new File([blob], image?.name ?? "avatar", {
            type: "image/jpeg",
            lastModified: Date.now()
          })])

          resolve()
        })
      })
    }
  }

  return (
    <ModalForm
      form={form}
      onSubmit={onSubmit}
      modalTitle="Edit Student Picture"
      open={open}
      setIsOpen={setIsOpen}
      showCreateButton={false}
      isSubmitting={isUploading}
    >
      {image && (
        <AvatarEditor
          ref={editor}
          image={image}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={1.2}
          rotate={0}
          borderRadius={150}
        />
      )}
      <FormItem>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setImage(file)
          }}
        />
      </FormItem>
    </ModalForm>
  )
}
