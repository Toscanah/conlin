import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodIssueCode, z } from "zod";

export const formSchema = z.object({
  username: z.string({ required_error: "Questo campo è richiesto" }),
  password: z.string({ required_error: "Questo campo è richiesto" }),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getLoginForm(): any {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
}
