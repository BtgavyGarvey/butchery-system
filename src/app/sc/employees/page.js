import { getServerSession } from "next-auth";
import NewEmployeesPage from "../../../../components/sc/employees";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - New Employee',
}

export default async function Employees() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }

  return (
    <>
    {
      session ? (
        <>
          {
            session.user.access !==1 ? (
              <NewEmployeesPage session={session}/>
            ):(
              toDashboard()
            )
          }
        </>
      ):(
        logOut()
      )
    }
    </>
  )
}
