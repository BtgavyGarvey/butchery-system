import { getServerSession } from "next-auth";
import EmployeesPage from "../../../../../components/sc/employees/view";
import authOptions from "../../../api/auth/[...nextauth]/options";

export default async function ViewEmployees() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <EmployeesPage session={session}/>
    </>
  )
}
