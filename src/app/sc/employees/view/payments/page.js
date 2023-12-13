import { getServerSession } from "next-auth";
import EmployeesPaymentPage from '../../../../../../components/sc/employees/payments/view';
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Employees Payments',
}

export default async function ViewEmployeesPayments() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <EmployeesPaymentPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
