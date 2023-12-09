import { getServerSession } from "next-auth";
import NewEmployeesPage from "../../../../components/sc/employees";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function Employees() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <NewEmployeesPage session={session}/>
    </>
  )
}
