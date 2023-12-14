import { getServerSession } from "next-auth";
import DashboardPage from "../../../../components/sc/dashboard";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Dashboard',
}

export default async function Dashboard() {

  const session=await getServerSession(authOptions)

  console.log(session);

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
