

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSession from "./sessions/AddSession";
import RidersPageButton from "./RidersPageButton";
import getRiders from "./sql/getRiders";
import Layout from "./stats/Layout";
import getActiveRiders from "./sql/getActiveRiders";
import { ChangeTheme } from "./ChangeTheme";
import ChangeParamsDialog from "./multipliers/ChangeParams";
import SessionsPageButton from "./SessionsPageButton";

export const dynamic = "force-dynamic";



export default async function Home() {
  return (
    <div className="flex justify-center items-center">
      
        <Tabs
          defaultValue="register-session"
          className="flex flex-col justify-center mt-10 items-center w-[90vw]"
        >
          <TabsList defaultValue="stats">
            <TabsTrigger value="register-session" className="w-[400px]">
              Aggiungi sessione
            </TabsTrigger>
            <TabsTrigger value="stats" className="w-[400px]">
              Statistiche
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="register-session"
            className="flex justify-center items-center w-[550px]"
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
      

      <div className="flex flex-col gap-4 absolute text-4xl top-4 left-4">
        <RidersPageButton />
        <ChangeParamsDialog/>
        <SessionsPageButton/>
      </div>

      <div className="absolute top-4 right-4 hover:cursor-pointer">
        <ChangeTheme />
      </div>
    </div>
  );
}
