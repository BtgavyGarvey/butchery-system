import { getServerSession } from "next-auth";
import EmployeesPaymentPage from '../../../../../../components/sc/employees/payments/view';
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

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
