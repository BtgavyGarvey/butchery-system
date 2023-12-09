import { getServerSession } from "next-auth";
import RollBackPage from "../../../../../../components/sc/products/sales/rollback";
import authOptions from "../../../../api/auth/[...nextauth]/options";

export default async function ViewSales() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <RollBackPage session={session}/>
    </>
  )
}
