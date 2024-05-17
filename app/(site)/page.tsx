import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSession from "./sessions/AddSession";
import RidersDialog from "./RidersPageButton";
import getRiders from "./sql/getRiders";
import Layout from "./stats/Layout";
import getActiveRiders from "./sql/getActiveRiders";

export default async function Home() {
  return (
    <div className="flex justify-center items-center">
      <Tabs
        defaultValue="register-session"
        className="flex flex-col justify-center mt-10 items-center"
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
          className="flex justify-center items-center w-[80vw] mt-0 gap-8"
        >
          <Layout riders={await getRiders()} />
        </TabsContent>
      </Tabs>

      <div className="absolute text-4xl top-4 left-4">
        <RidersDialog />
      </div>
    </div>
  );
}
