import { getServerSession } from "next-auth";
import ViewSalesPage from "../../../../../../components/sc/products/sales/viewsales";
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
        <ViewSalesPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
