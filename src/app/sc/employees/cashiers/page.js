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

  return (
    <>
    {
      session ? (
        <CashierPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
