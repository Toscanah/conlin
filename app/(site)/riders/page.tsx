import getRiders from "../sql/getRiders";
import BackHome from "./BackHome";
import RidersTable from "./table/RidersTable";

export const dynamic = "force-dynamic";

export default async function ManageRiders() {
  const riders = await getRiders();

  return (
    <div className="mt-10 flex justify-center items-center flex-col gap-8">
      <h1 className="text-4xl">Ragazzi per le consegne</h1>
      <div className="w-[60%] p-1 h-[80vh]">
        <RidersTable initialRiders={riders} />
      </div>

      <div className="absolute text-4xl top-4 left-4">
        <BackHome />
      </div>
    </div>
  );
}
