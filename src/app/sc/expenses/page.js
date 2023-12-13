import { getServerSession } from "next-auth";
import ExpensesPage from "../../../../components/sc/expenses";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function Dashboard() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <ExpensesPage session={session}/>
    </>
  )
}
