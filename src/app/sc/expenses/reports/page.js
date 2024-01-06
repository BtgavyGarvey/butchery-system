import { getServerSession } from "next-auth";
import ExpensesReportPage from "../../../../../components/sc/expenses/reports";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Expenses Report Dashboard',
}

export default async function ExpenseReports() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <ExpensesReportPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
