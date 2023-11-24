import { getServerSession } from "next-auth";
import ViewProductsPage from "../../../../../components/sc/products/viewproducts";
import authOptions from "../../../api/auth/[...nextauth]/options";

export default async function ViewProducts() {

  const session=await getServerSession(authOptions)


  return (
    <>
    <ViewProductsPage session={session}/>
    </>
  )
}
