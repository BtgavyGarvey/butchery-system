import { getServerSession } from "next-auth";
import CashierPage from "../../../../../components/sc/employees/cashiers";
import authOptions from "../../../api/auth/[...nextauth]/options";

export default async function Cashier() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <CashierPage session={session}/>
    </>
  )
}
