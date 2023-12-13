import { getServerSession } from "next-auth";
import ViewProductsPage from "../../../../../components/sc/products/viewproducts";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function ViewProducts() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <ViewProductsPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
