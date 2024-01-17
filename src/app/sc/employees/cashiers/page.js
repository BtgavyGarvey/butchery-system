import { getServerSession } from "next-auth";
import CashierPage from "../../../../../components/sc/employees/cashiers";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - View Cashiers',
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
              <CashierPage session={session}/>
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
