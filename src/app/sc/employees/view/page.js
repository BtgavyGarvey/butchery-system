import { getServerSession } from "next-auth";
import EmployeesPage from "../../../../../components/sc/employees/view";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - View Employees',
}

export default async function ViewEmployees() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <EmployeesPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
