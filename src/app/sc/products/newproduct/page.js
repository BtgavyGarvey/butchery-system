import { getServerSession } from "next-auth";
import NewProductPage from "../../../../../components/sc/products/newproduct";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - New Product',
}

export default async function NewProduct() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }


  return (
    <>
    {
      session ? (
        <>
          {
            session.user.access !==1 ? (
              <NewProductPage session={session}/>
            ):(
              toDashboard()
            )
          }
        </>
      ):(
        logOut()
      )
    }
    </>
  )
}
