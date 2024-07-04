import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSession from "../sessions/actions/AddSession";
import RidersPageButton from "../RidersPageButton";
import getRiders from "../sql/getRiders";
import Layout from "../stats/Layout";
import getActiveRiders from "../sql/getActiveRiders";
import { ChangeTheme } from "../ChangeTheme";
import ChangeParamsDialog from "../ChangeParams";
import SessionsPageButton from "../SessionsPageButton";
import Link from "next/link";
import { useContext } from "react";

import Logout from "../Logout";
import Sidebar from "./Sidebar";

export const dynamic = "force-dynamic";

export default async function Main() {
  return (
    <div className="flex justify-center items-center w-full">
      <Tabs
        defaultValue="register-session" /**si cambia da qua il default */
        className="flex flex-col justify-center items-center w-full p-10 "
      >
        <TabsList defaultValue="register-session" className="w-full h-[50px] ">
          <TabsTrigger
            value="register-session"
            className="w-[50%] h-[46px] text-xl"
          >
            Turni
          </TabsTrigger>
          <TabsTrigger value="stats" className="w-[50%] h-[46px] text-xl">
            Statistiche
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="register-session"
          className="flex justify-center items-center w-[55%]"
        >
          <AddSession riders={await getActiveRiders()} />
        </TabsContent>
        <TabsContent
          value="stats"
          className="flex justify-center items-center w-[100%] mt-0 gap-8"
        >
          <Layout riders={await getRiders()} />
        </TabsContent>
      </Tabs>

      {/* <div className="flex flex-col gap-2 text-4xl fixed 
      left-4 top-1/2 transform -translate-y-1/2 
      bg-foreground/5 rounded-lg p-2">
        
      </div> */}

      <Sidebar />

      {/* <div className="fixed bottom-4 right-4 hover:cursor-pointer">
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
      </div> */}
    </div>
  );
}
