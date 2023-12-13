import { getServerSession } from "next-auth";
import DashboardPage from "../../../../components/sc/dashboard";
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
        <DashboardPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
