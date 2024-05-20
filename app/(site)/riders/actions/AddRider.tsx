"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Rider } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import BarLoader from "react-spinners/BarLoader";
import getRiderForm, { FormValues } from "../../forms/getRiderForm";
import { useState } from "react";
import { UserPlus } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AddRider({
  onAddedRider,
}: {
  onAddedRider: (newRider: Rider) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const form = getRiderForm(null);
  const { toast } = useToast();

  function onSubmit(values: FormValues) {
    setSubmitted(true);

    fetch("/api/riders/add/", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        surname: values.surname,
        nickname: values.nickname ? values.nickname : "",
        is_active: values.isActive ? values.isActive : false,
      }),
    }).then((response) => {
      if (response.ok) {
        // per qualche motivo il form non si svuota quando submitto, fix: forzare il clear
        // forse si potrebbe essere prima del fetch, per forse non andrà ad intaccare "values"?
        form.resetField("name");
        form.resetField("surname");
        form.resetField("nickname");
        form.resetField("isActive");

        response.json().then((addedRider) => {
          onAddedRider(addedRider);
          setSubmitted(false);
          setOpenDialog(false);

          toast({
            title: "Successo",
            duration: 3000,
            description: "Il ragazzo è stato aggiunto correttamente!",
          });
    
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
      }
    });
  }

  return (
    <div className="ml-auto">
      <Dialog open={openDialog}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setOpenDialog(true)}>
            <UserPlus className="mr-2 h-5 w-5" />
            Aggiungi ragazzo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">
              Aggiungi ragazzo per le consegne
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
                        Sto aggiungendo
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <DialogClose asChild>
                          <Button variant={"secondary"} onClick={() => setOpenDialog(false)}>
                            Indietro
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="submit">Aggiungi</Button>
                        </DialogClose>
                      </div>
                    )}
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
