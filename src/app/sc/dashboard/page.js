import { getServerSession } from "next-auth";
import DashboardPage from "../../../../components/sc/dashboard";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function Dashboard() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <DashboardPage session={session}/>
    </>
  )
}
