import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodIssueCode, z } from "zod";

const ordersSchema = z.coerce
  .string()
  .optional()
  .pipe(
    z.coerce
      .number({
        invalid_type_error: "Accettati solo numeri",
      })
      .nonnegative({ message: "Il numero deve essere positivo" })
      .refine((value) => {
        if (Number.isInteger(value)) {
          return true;
        }
        throw new z.ZodError([
          {
            code: ZodIssueCode.custom,
            path: ["errorMessage"],
            message: "Assicurati che gli ordini siano numeri interi",
          },
        ]);
      })
      .optional()
  );

const timeSchema = z.coerce
  .string()
  .optional()
  .pipe(
    z.coerce
      .number({
        invalid_type_error: "Accettati solo numeri",
      })
      .nonnegative({ message: "Il numero deve essere positivo" })
      .optional()
  );

const tipSchema = z.coerce
  .string()
  .optional()
  .pipe(
    z.coerce
      .number({
        invalid_type_error: "Accettati solo numeri",
      })
      .nonnegative({ message: "Il numero deve essere positivo" })
      .optional()
  );

export const formSchema = z
  .object({
    rider: z.string({
      required_error: "Questo campo è richiesto",
    }),
    lunchOrders: ordersSchema,
    dinnerOrders: ordersSchema,
    lunchTime: timeSchema,
    dinnerTime: timeSchema,
    tipLunch: tipSchema,
    tipDinner: tipSchema,
    date: z.date().optional(),
    errorMessage: z.string().optional(),
  })
  .refine(
    (data) => {
      const allFieldsUndefined =
        (data.lunchOrders === undefined || data.lunchOrders === 0) &&
        (data.dinnerOrders === undefined || data.dinnerOrders === 0) &&
        (data.lunchTime === undefined || data.lunchTime === 0) &&
        (data.dinnerTime === undefined || data.dinnerTime === 0);

      // se tutti i campi sono vuoti allora via
      if (allFieldsUndefined) {
        return false;
      }

      if (
        // VA BENE, basta che almeno una delle due ore non sia vuota
        (data.lunchTime !== 0 && data.lunchTime !== undefined) ||
        (data.dinnerTime !== 0 && data.dinnerTime !== undefined)
      ) {
        if (
          (data.lunchOrders !== 0 &&
            data.lunchOrders !== undefined &&
            (data.lunchTime === 0 || data.lunchTime === undefined)) ||
          (data.dinnerOrders !== 0 &&
            data.dinnerOrders !== undefined &&
            (data.dinnerTime === 0 || data.dinnerTime === undefined))
        ) {
          return false;
        }

        return true;
      }
    },
    {
      message:
        'Assicurati che le consegne abbiano un rispettivo ammontare di ore o che almeno un campo "ore" non sia vuoto.',
      path: ["errorMessage"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;

export default function getSessionForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
}
