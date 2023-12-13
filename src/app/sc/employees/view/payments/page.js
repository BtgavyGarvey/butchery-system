import { getServerSession } from "next-auth";
import EmployeesPaymentPage from '../../../../../../components/sc/employees/payments/view';
import authOptions from "../../../../api/auth/[...nextauth]/options";

export default async function ViewEmployeesPayments() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <EmployeesPaymentPage session={session}/>
    </>
  )
}
