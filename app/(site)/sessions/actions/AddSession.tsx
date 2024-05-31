"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  CaretUpDown,
  Check,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Question } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";
import BarLoader from "react-spinners/BarLoader";
import { it } from "date-fns/locale";
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
import getSessionForm, { FormValues } from "../../forms/getSessionForm";
import { Calendar } from "@/components/ui/calendar";
import { MultiplierContext } from "../../multipliers/MultipliersProvider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PopoverClose } from "@radix-ui/react-popover";

export const dynamic = "force-dynamic";

export default function AddSession({
  riders: receivedRiders,
}: {
  riders: Rider[];
}) {
  const riders = receivedRiders;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [session, setSession] = useState<FormValues>();
  const [total, setTotal] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const form: any = getSessionForm();
  const { toast } = useToast();
  const [ridersPopoverOpen, setRidersPopoverOpen] = useState<boolean>(false);

  const { lunchMultiplier, dinnerMultiplier, ordersMultiplier } =
    useContext(MultiplierContext);

  function onSubmit(values: FormValues) {
    setConfirmDialogOpen(true);
    setSession(values);

    const lunch = values.lunchTime
      ? lunchMultiplier * values.lunchTime +
        ordersMultiplier * (values.lunchOrders ?? 0)
      : 0;
    const dinner = values.dinnerTime
      ? dinnerMultiplier * values.dinnerTime +
        ordersMultiplier * (values.dinnerOrders ?? 0)
      : 0;

    const lunchTip = values.tipLunch ?? 0;
    const dinnerTip = values.tipDinner ?? 0;
    const totalTip = lunchTip + dinnerTip;

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

    if (totalTip > 0) {
      if (final) {
        final += " + ";
      }
      final += totalTip.toFixed(2);
      total += totalTip;
    }

    if (final && ((dinner > 0 && lunch > 0) || totalTip > 0)) {
      final += " = " + total.toFixed(2);
    } else {
      final = total.toFixed(2);
    }

    setTotal(final);
  }

  function insertData() {
    setConfirmDialogOpen(false);
    setLoading(true);

    fetch("/api/sessions/add/", {
      method: "POST",

      body: JSON.stringify({
        rider_id: session?.rider.id,
        lunch_orders: session?.lunchOrders,
        dinner_orders: session?.dinnerOrders,
        lunch_time: session?.lunchTime,
        dinner_time: session?.dinnerTime,
        tip_lunch: session?.tipLunch,
        tip_dinner: session?.tipDinner,
        date: session?.date ?? new Date(),
      }),
    }).then(() => {
      setLoading(false);

      toast({
        title: "Successo",
        duration: 3000,
        description: "La sessione è stata registrata correttamente!",
      });

      setTimeout(() => {
        window.location.reload();
      }, 0);
    });
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-4xl my-8">Aggiungi turno</h1>
      {loading && (
        <BarLoader
          color="#00C0FF"
          loading={loading}
          width={"100%"}
          className="mb-4"
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex justify-center w-[90%] flex-col items-center"
        >
          <div className="w-[100%] flex justify-between items-center">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-[47.5%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    Data
                  </FormLabel>
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
                            format(field.value, "PPP", { locale: it })
                          ) : (
                            <span></span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={it}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
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

            <FormField
              control={form.control}
              name="rider"
              render={({ field }) => (
                <FormItem className="w-[47.5%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    Ragazzo
                  </FormLabel>

                  <Popover>
                    {/**open={ridersPopoverOpen} */}
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[100%] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => {
                            //setRidersPopoverOpen(true);
                          }}
                        >
                          {field.value ? (
                            field.value.nickname ??
                            field.value.name + " " + field.value.surname
                          ) : (
                            <span className="invisible">no placeholder</span>
                          )}
                          <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command>
                        <CommandInput placeholder="Cerca..." />
                        <CommandEmpty>Nessun ragazzo trovato</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {riders?.length ? (
                              riders.map((rider) => (
                                <CommandItem
                                  key={rider.id}
                                  onSelect={() => {
                                    form.setValue("rider", rider);
                                    //setRidersPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      rider === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {rider.name} {rider.surname ?? ""}{" "}
                                  {rider.nickname && (
                                    <>
                                      (<strong>{rider.nickname}</strong>)
                                    </>
                                  )}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandEmpty>
                                Nessun ragazzo trovato
                              </CommandEmpty>
                            )}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage>
                    {form.formState.errors.rider?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="w-[100%] flex justify-between items-center">
            <FormField
              control={form.control}
              name="lunchOrders"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>
                      Consegne a <strong>PRANZO</strong>
                    </div>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Question size={16} />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Lascia vuoto se le consegne sono 0
                      </HoverCardContent>
                    </HoverCard>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lunchTime"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between">
                    <div>
                      Ore a <strong>PRANZO</strong>
                    </div>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Question size={16} />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Le ore posso anche essere "mezze", es: 4.3 ore
                      </HoverCardContent>
                    </HoverCard>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipLunch"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>
                      Mancia a <strong>PRANZO</strong>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-[100%] flex justify-between">
            <FormField
              control={form.control}
              name="dinnerOrders"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>
                      Consegne a <strong>CENA</strong>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dinnerTime"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between ">
                    <div>
                      Ore a <strong>CENA</strong>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipDinner"
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>
                      Mancia a <strong>CENA</strong>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" name="submit" className="w-[100%]">
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

                <AlertDialogDescription className="text-xl">
                  <Separator className="my-2" />
                  {session && (
                    <div className="flex flex-col gap-1 text-foreground">
                      <a>
                        Ragazzo: <strong>{session.rider.nickname}</strong>
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
                                lunchMultiplier * session.lunchTime +
                                ordersMultiplier * (session.lunchOrders ?? 0)
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
                                dinnerMultiplier * session.dinnerTime +
                                ordersMultiplier * (session.dinnerOrders ?? 0)
                              ).toFixed(2) + "€"}
                              )
                            </strong>
                          </a>
                        )}
                      {(session.tipLunch !== undefined &&
                        session.tipLunch !== 0) ||
                      (session.tipDinner !== undefined &&
                        session.tipDinner !== 0) ? (
                        <a>
                          Mancia:{" "}
                          <strong>
                            {session.tipLunch !== undefined &&
                            session.tipLunch !== 0
                              ? session.tipLunch + "€"
                              : ""}
                            {session.tipLunch !== undefined &&
                            session.tipLunch !== 0 &&
                            session.tipDinner !== undefined &&
                            session.tipDinner !== 0
                              ? " + "
                              : ""}
                            {session.tipDinner !== undefined &&
                            session.tipDinner !== 0
                              ? session.tipDinner + "€"
                              : ""}
                            {session.tipLunch !== undefined &&
                            session.tipLunch !== 0 &&
                            session.tipDinner !== undefined &&
                            session.tipDinner !== 0
                              ? " = " +
                                (session.tipLunch + session.tipDinner) +
                                "€"
                              : ""}
                          </strong>
                        </a>
                      ) : null}

                      {session?.date && (
                        <a>
                          Data:{" "}
                          <strong>
                            {session?.date
                              ? session.date.toLocaleDateString()
                              : new Date().toLocaleDateString()}
                          </strong>
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
