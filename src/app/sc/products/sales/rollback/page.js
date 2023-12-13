import { getServerSession } from "next-auth";
import RollBackPage from "../../../../../../components/sc/products/sales/rollback";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function ViewSales() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <RollBackPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
