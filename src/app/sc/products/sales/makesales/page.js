import { getServerSession } from "next-auth";
import MakeSalesPage from "../../../../../../components/sc/products/sales/makesales";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { getProducts } from "../../../../api/v1/controller/butchery/route";

export default async function MakeSales() {

  const session=await getServerSession(authOptions)
  let response
  response=await getProducts(session,1)

  return (
    <>
    <MakeSalesPage session={session} data={response}/>
    </>
  )
}
