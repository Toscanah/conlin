"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Rider } from "@prisma/client";
import getSessionForm, { FormValues } from "../forms/getSessionForm";

export default function AddSession({
  riders: receivedRiders,
}: {
  riders: Rider[];
}) {
  const riders = receivedRiders;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [session, setSession] = useState<FormValues>();
  const [total, setTotal] = useState<string | undefined>("");
  const form = getSessionForm();

  function onSubmit(values: FormValues) {
    setConfirmDialogOpen(true);
    setSession(values);

    const lunch = values.lunchTime
      ? 6 * values.lunchTime + (values.lunchOrders ?? 0)
      : 0;
    const dinner = values.dinnerTime
      ? 7 * values.dinnerTime + (values.dinnerOrders ?? 0)
      : 0;
    const tip = values.tip ?? 0;

    let final = "";
    let total = 0;

    if (lunch > 0) {
      final += lunch.toFixed(2);
      total += lunch;
    }

    if (lunch > 0 && dinner > 0) {
      final += " + ";
    }

    if (dinner > 0) {
      final += dinner.toFixed(2);
      total += dinner;
    }

    if (tip > 0) {
      if (final) {
        final += " + ";
      }
      final += tip.toFixed(2);
      total += tip;
    }

    if (final) {
      final += " = " + total.toFixed(2);
    } else {
      final = total.toFixed(2);
    }

    setTotal(final);
  }

  function insertData() {
    // TODO:: loading
    fetch("/api/sessions/add/", {
      method: "POST",
      body: JSON.stringify({
        rider_id: Number.parseInt(
          session?.rider.charAt(0) ? session?.rider.charAt(0) : ""
        ),
        lunch_orders: session?.lunchOrders,
        dinner_orders: session?.dinnerOrders,
        lunch_time: session?.lunchTime,
        dinner_time: session?.dinnerTime,
        tip: session?.tip,
      }),
    }).then(() => {
      window.location.reload();
    });
  }

  // TODO: il dialogo deve essere piu largo
  // togliere gli zeri dai vai calcoli

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-4xl my-8">Aggiungi sessione</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex justify-center w-full flex-col items-center"
        >
          <FormField
            control={form.control}
            name="rider"
            render={({ field }) => (
              <FormItem className="w-[100%]">
                <FormLabel>Ragazzo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un ragazzo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {riders.map((rider) => (
                      <SelectItem
                        key={rider.id}
                        value={rider.id.toString() + "-" + rider.nickname}
                      >
                        {rider.name +
                          " " +
                          (rider.surname ? rider.surname : "")}
                        {rider.nickname && (
                          <>
                            {" "}
                            (<strong>{rider.nickname}</strong>)
                          </>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {form.formState.errors.rider?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <div className="w-[100%] flex justify-between">
            <FormField
              control={form.control}
              name="lunchOrders"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>
                    Consegne a <strong>PRANZO</strong>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Numero di consegne PRANZO" {...field} />
                  </FormControl>
                  <FormDescription className="">
                    Lascia vuoto se 0 consegne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dinnerOrders"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>
                    Consegne a <strong>CENA</strong>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Numero di consegne CENA" {...field} />
                  </FormControl>
                  <FormDescription className="">
                    Lascia vuoto se 0 consegne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-[100%] flex justify-between">
            <FormField
              control={form.control}
              name="lunchTime"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>
                    Ore a <strong>PRANZO</strong>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Numero di ore PRANZO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dinnerTime"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>
                    Ore a <strong>CENA</strong>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Numero di ore CENA" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormDescription className="text-center flex flex-col w-[450px]">
            <a>
              Puoi anche utilizzare ore non esatte, es: "2.5" (2 ore e mezza)
            </a>
            <a>Lascia vuoto se non il ragazzo non ha lavorato</a>
          </FormDescription>

          <FormField
            control={form.control}
            name="tip"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Mancia</FormLabel>
                <FormControl>
                  <Input placeholder="Mancia" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" name="submit" className="w-[200px]">
            Registra
          </Button>

          <FormField
            control={form.control}
            name="errorMessage"
            render={({ field }) => (
              <FormItem className="flex items-center text-center justify-center w-full">
                <FormMessage />
              </FormItem>
            )}
          />

          <AlertDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
          >
            <AlertDialogContent className="min-w-[30vw]">
              <AlertDialogHeader className="">
                <AlertDialogTitle className="text-4xl">
                  Riepilogo
                </AlertDialogTitle>

                <AlertDialogDescription className="text-xl text-black">
                  <Separator className="my-2" />
                  {session && (
                    <div className="flex flex-col gap-1">
                      <a>
                        Ragazzo: <strong>{session.rider.split("-")[1]}</strong>
                      </a>
                      {session.lunchTime !== undefined &&
                        session.lunchTime !== 0 && (
                          <a>
                            Pranzo:{" "}
                            <strong>
                              {session.lunchOrders === undefined
                                ? 0
                                : session.lunchOrders}{" "}
                              ordini per {session.lunchTime} ore (
                              {(
                                6 * session.lunchTime +
                                (session.lunchOrders ?? 0)
                              ).toFixed(2) + "€"}
                              )
                            </strong>
                          </a>
                        )}
                      {session.dinnerTime !== undefined &&
                        session.dinnerTime !== 0 && (
                          <a>
                            Cena:{" "}
                            <strong>
                              {session.dinnerOrders === undefined
                                ? 0
                                : session.dinnerOrders}{" "}
                              ordini per {session.dinnerTime} ore (
                              {(
                                7 * session.dinnerTime +
                                (session.dinnerOrders ?? 0)
                              ).toFixed(2) + "€"}
                              )
                            </strong>
                          </a>
                        )}
                      {session !== undefined && session.tip !== 0 && (
                        <a>
                          Mancia: <strong>{session.tip}€</strong>
                        </a>
                      )}
                      <a>
                        Totale: <strong>{total}€</strong>
                      </a>
                    </div>
                  )}
                  <Separator className="my-2" />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setConfirmDialogOpen(false);
                  }}
                >
                  Cancella
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    insertData();
                  }}
                >
                  Conferma
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
}
