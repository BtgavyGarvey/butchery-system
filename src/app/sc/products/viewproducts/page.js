import { getServerSession } from "next-auth";
import ViewProductsPage from "../../../../../components/sc/products/viewproducts";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - View Products',
}

export default async function ViewProducts() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  // const toDashboard=()=>{
  //   redirect('/sc/dashboard')
  // }


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
