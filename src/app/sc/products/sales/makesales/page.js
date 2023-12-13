import { getServerSession } from "next-auth";
import MakeSalesPage from "../../../../../../components/sc/products/sales/makesales";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { getProducts } from "../../../../api/v1/controller/butchery/route";
import { redirect } from "next/navigation";

export default async function MakeSales() {

  const session=await getServerSession(authOptions)
  let response
  response=await getProducts(session,1)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <MakeSalesPage session={session} data={response}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
