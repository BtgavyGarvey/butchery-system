import { getServerSession } from "next-auth";
import NewEmployeesPage from "../../../../components/sc/employees";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Employees() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <NewEmployeesPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
