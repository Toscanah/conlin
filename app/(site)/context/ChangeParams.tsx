"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import getParamsForm, { FormValues } from "../forms/getParamsForm";

export default function ChangeParamsDialog() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [lunchMultiplier, setLunchMultiplier] = useState<number>(6);
  const [dinnerMultiplier, setDinnerMultiplier] = useState<number>(7);
  const [ordersMultiplier, setOrdersMultiplier] = useState<number>(1);

  const form = getParamsForm(
    lunchMultiplier,
    dinnerMultiplier,
    ordersMultiplier
  );

  useEffect(() => {
    async function fetchMultipliers() {
      const response = await fetch("/api/multipliers/get", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setLunchMultiplier(data.lunchMultiplier);
          setDinnerMultiplier(data.dinnerMultiplier);
          setOrdersMultiplier(data.ordersMultiplier);
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

    try {
      const response = await fetch("/api/multipliers/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value: parsedValue }),
      });

      if (response.ok) {
        switch (field) {
          case "lunch":
            setLunchMultiplier(value);
            break;
          case "dinner":
            setDinnerMultiplier(value);
            break;
          case "orders":
            setOrdersMultiplier(value);
            break;
          default:
            break;
        }
      } else {
        console.error("Failed to update multiplier", response.status);
      }
    } catch (error) {
      console.error("Error updating multiplier", error);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Sliders
          size={40}
          className="hover:cursor-pointer hover:scale-110 hover:bg-white hover:bg-opacity-5 rounded p-1"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
