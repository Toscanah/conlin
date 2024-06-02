"use client";

import Link from "next/link";
import { ChangeTheme } from "./ChangeTheme";
import getLoginForm, { FormValues } from "./forms/getLoginForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useContext } from "react";


export default function Home() {
  const form = getLoginForm();

  function onSubmit(values: FormValues) {
    const { username, password } = values;

    const envUsername = process.env.NEXT_PUBLIC_LOGIN_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

    console.log(envUsername);
    console.log(envPassword);

    if (username === envUsername && password === envPassword) {
      window.location.replace("./home");
    } else {
      console.log("Login failed");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[25%] flex flex-col justify-center gap-4 items-center">
        <h1 className="text-4xl">Login</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex justify-center w-full flex-col items-center"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>Username</div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex items-center justify-between h-[16px]">
                    <div>Username</div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" name="submit" className="w-full">
              Entra
            </Button>
          </form>
        </Form>
      </div>

      <div className="fixed bottom-4 right-4 hover:cursor-pointer">
        <ChangeTheme />
      </div>

      <div className="fixed bottom-4 left-4 flex flex-col justify-center">
        <Link
          className="text-xs hover:cursor-pointer hover:underline"
          href={"https://github.com/Toscanah/conlin"}
          rel="noopener noreferrer"
          target="_blank"
        >
          Cecchini A. © - fatto per Lin
        </Link>
      </div>
    </div>
  );
}
