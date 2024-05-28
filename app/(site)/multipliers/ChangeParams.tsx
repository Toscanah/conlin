"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Sliders } from "@phosphor-icons/react";
import { MultiplierContext } from "../multipliers/MultipliersProvider";
import { useContext, useState } from "react";
import getParamsForm, { FormValues } from "../forms/getParamsForm";

export default function ChangeParamsDialog() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    lunchMultiplier,
    dinnerMultiplier,
    ordersMultiplier,
    setLunchMultiplier,
    setDinnerMultiplier,
    setOrdersMultiplier,
  } = useContext(MultiplierContext);

  const form: any = getParamsForm(
    lunchMultiplier,
    dinnerMultiplier,
    ordersMultiplier
  );

  function onSubmit(values: FormValues) {
    setLunchMultiplier(values.lunch_mult);
    setDinnerMultiplier(values.dinner_mult);
    setOrdersMultiplier(values.orders_mult);

    setOpenDialog(false);
  }

  return (
    <Dialog open={openDialog}>
      <DialogTrigger asChild className="">
        <Sliders
          size={40}
          className="hover:cursor-pointer hover:scale-110 hover:bg-white hover:bg-opacity-5 rounded p-1"
          onClick={(e) => setOpenDialog(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambia i parametri</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex justify-center w-full flex-col "
          >
            <FormField
              control={form.control}
              name="lunch_mult"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    Moltiplicatore <strong>PRANZO</strong>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dinner_mult"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    Moltiplicatore <strong>CENA</strong>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orders_mult"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    Moltiplicatore <strong>ORDINI</strong>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 w-full">
              <Button
                onClick={() => setOpenDialog(false)}
                variant={"secondary"}
              >
                Indietro
              </Button>
              <Button type="submit">Salva</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
