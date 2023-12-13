import { getServerSession } from "next-auth";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import CashiersLoginActivitiesPage from "../../../../../../components/sc/employees/cashiers/loginActivities";

export default async function Cashier() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <CashiersLoginActivitiesPage session={session}/>
    </>
  )
}
