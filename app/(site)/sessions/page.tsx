import BackHome from "../../components/BackHome";
import getRiders from "../sql/getRiders";
import getSessionsWithRiders from "../sql/sessions/getSessionsWithRiders";
import SessionsTable from "./table/SessionsTable";

export default async function manageSessions() {
  return (
    <div className="p-10 flex justify-center items-center flex-col gap-8 w-full">
      <h1 className="text-4xl">Turni</h1>
      <div className="w-[85%] h-[80vh]">
        <SessionsTable initialSessions={await getSessionsWithRiders()} riders={await getRiders()}/>
      </div>

      <div className="absolute text-4xl top-4 left-4">
        <BackHome path="../home/"/>
      </div>
    </div>
  );
}
