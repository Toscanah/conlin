import { zodResolver } from "@hookform/resolvers/zod";
import { Rider } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ required_error: "Questo campo è richiesto" }).min(2, {
    message: "Almeno 2 caratteri",
  }),
  surname: z
    .string({ required_error: "Questo campo è richiesto" })
    .min(2, { message: "Almeno 2 caratteri" }),
  nickname: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getRiderForm(rider: Rider | null) {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: rider?.name,
      surname: rider?.surname,
      nickname: rider?.nickname ? rider?.nickname : "",
      isActive: rider?.is_active,
    },
  });
}
