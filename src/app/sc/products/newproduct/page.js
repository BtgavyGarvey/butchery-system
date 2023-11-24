import { getServerSession } from "next-auth";
import NewProductPage from "../../../../../components/sc/products/newproduct";
import authOptions from "../../../api/auth/[...nextauth]/options";

export default async function NewProduct() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <NewProductPage session={session}/>
    </>
  )
}
