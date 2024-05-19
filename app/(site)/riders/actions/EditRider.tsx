"use client";

import BarLoader from "react-spinners/BarLoader";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "@phosphor-icons/react";
import { Rider } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import getRiderForm, { FormValues } from "../../forms/getRiderForm";

export default function EditRider({
  rider,
  onEdit,
}: {
  rider: Rider;
  onEdit: (rider: Rider) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const form = getRiderForm(rider);

  function onSubmit(values: FormValues) {
    setSubmitted(true);
    fetch("/api/riders/edit/", {
      method: "POST",
      body: JSON.stringify({
        riderId: rider.id,
        name: values.name,
        surname: values.surname,
        nickname: values.nickname,
        isActive: values.isActive,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((editedRider) => {
          onEdit(editedRider);
          setSubmitted(false);
          window.location.reload();
        });
      }
    });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Pencil size={32} className="hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">
              Modifica ragazzo per le consegne
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Il ragazzo sta attualmente lavorando con te?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <DialogFooter>
                    {submitted ? (
                      // <BarLoader
                      //   color={"#ff0000"}
                      //   loading={loading}
                      //   width={"464px"}
                      //   aria-label="Loading Spinner"
                      //   data-testid="loader"
                      // />

                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sto modificando
                      </Button>
                    ) : (
                      <Button type="submit">Modifica</Button>
                    )}
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
