"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sliders } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import getParamsForm, { FormValues } from "./forms/getParamsForm";

export default function ChangeParamsDialog() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const form = getParamsForm();

  useEffect(() => {
    async function fetchMultipliers() {
      const response = await fetch("/api/multipliers/get", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          form.setValue("lunch_mult", data.lunchMultiplier);
          form.setValue("dinner_mult", data.dinnerMultiplier);
          form.setValue("orders_mult", data.ordersMultiplier);
        }
      }
    }

    fetchMultipliers();
  }, []);

  function onSubmit(values: FormValues) {
    if (values) {
      updateMultiplier("lunch", values.lunch_mult);
      updateMultiplier("dinner", values.dinner_mult);
      updateMultiplier("orders", values.orders_mult);
      setOpenDialog(false);

      window.location.reload();
    }
  }

  async function updateMultiplier(field: string, value: number) {
    const parsedValue = Number.parseFloat(value.toFixed(2));

    await fetch("/api/multipliers/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field, value: parsedValue }),
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <div
          className="flex gap-3 items-center 
      hover:cursor-pointer hover:bg-foreground/5 hover:underline
      rounded p-2"
        >
          <Sliders size={32} />
          <span className="text-sm">Parametri</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Cambia i parametri</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex justify-center w-full flex-col"
          >
            <FormField
            
              control={form.control}
              name="lunch_mult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Moltiplicatore <strong>PRANZO</strong>
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
              name="dinner_mult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Moltiplicatore <strong>CENA</strong>
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
              name="orders_mult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Moltiplicatore <strong>ORDINI</strong>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2 w-full">
              <DialogClose asChild>
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant={"secondary"}
                >
                  Indietro
                </Button>
              </DialogClose>

              <Button type="submit">Salva</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
