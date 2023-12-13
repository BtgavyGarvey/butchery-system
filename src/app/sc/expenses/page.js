import { getServerSession } from "next-auth";
import ExpensesPage from "../../../../components/sc/expenses";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <ExpensesPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
