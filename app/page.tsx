import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSession from "./components/sessions/AddSession";
import RidersDialog from "./components/riders/RidersPageButton";

export default function Home() {
  return (
    <div className="flex justify-center items-center">
      <Tabs
        defaultValue="register-session"
        className="flex flex-col justify-center mt-10 items-center"
      >
        <TabsList>
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
          <AddSession />
        </TabsContent>
        <TabsContent value="stats">Change your password here.</TabsContent>
      </Tabs>

      <div className="absolute text-4xl top-4 left-4">
        <RidersDialog />
      </div>
    </div>
  );
}
