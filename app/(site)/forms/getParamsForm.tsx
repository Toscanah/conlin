"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

const field = z.coerce
  .string()
  .min(1, { message: "Questo campo è richiesto" })
  .pipe(
    z.coerce
      .number({
        required_error: "Questo campo è richiesto",
        invalid_type_error: "Accettati solo numeri",
      })
      .nonnegative({ message: "Il numero deve essere positivo" })
  );

export const formSchema = z.object({
  lunch_mult: field,
  dinner_mult: field,
  orders_mult: field,
});

export type FormValues = z.infer<typeof formSchema>;

export default function getParamsForm(
  lunchMultiplier: number,
  dinnerMultiplier: number,
  ordersMultiplier: number
) {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),

  });
}
