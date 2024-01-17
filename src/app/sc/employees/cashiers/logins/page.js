import { getServerSession } from "next-auth";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import CashiersLoginActivitiesPage from "../../../../../../components/sc/employees/cashiers/loginActivities";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Cashier Logins',
}

export default async function Cashier() {

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
              <CashiersLoginActivitiesPage session={session}/>
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
