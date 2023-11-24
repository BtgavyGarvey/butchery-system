import { getServerSession } from "next-auth";
import ViewSalesPage from "../../../../../../components/sc/products/sales/viewsales";
import authOptions from "../../../../api/auth/[...nextauth]/options";

export default async function ViewSales() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <ViewSalesPage session={session}/>
    </>
  )
}
