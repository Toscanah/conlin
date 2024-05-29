import BackHome from "../../components/BackHome";
import getSessionsWithRiders from "../sql/getSessionsWithRiders";
import SessionsTable from "./table/SessionsTable";

export default async function manageSessions() {
  console.log(await getSessionsWithRiders());
  return (
    <div className="p-10 flex justify-center items-center flex-col gap-8">
      <h1 className="text-4xl">Turni</h1>
      <div className="w-[85%] h-[80vh]">
        <SessionsTable initialSessions={await getSessionsWithRiders()}/>
      </div>

      <div className="absolute text-4xl top-4 left-4">
        <BackHome />
      </div>
    </div>
  );
}
