import { getServerSession } from "next-auth";
import NewProductPage from "../../../../../components/sc/products/newproduct";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function NewProduct() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <NewProductPage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
