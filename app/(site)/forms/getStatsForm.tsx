import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  rider: z
    .string({
      required_error: "Questo campo è richiesto",
    })
    .optional(),
  date: z.string({
    /**Any type of combination of coerce, string, date etc
     * can't get zod to accept a date range. 
     * The (horrible) solution is to put the field optional,
     * so that the from can be submitted. This works because
     * there's a state that keeps the selected date, plus the
     * calendar automatically submit the form when it detects a change.
     * So where the form gets submitted the date will be undefined
     * but the state will have the chosen date range
     */
    required_error: "Questo campo è richiesto",
  }).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getStatsForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
}
