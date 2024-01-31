import { getServerSession } from "next-auth";
import RollBackPage from "../../../../../../components/sc/products/sales/rollback";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Roll Back Sales',
}

export default async function ViewSales() {

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
              session.user.package ===2 ?(
                <RollBackPage session={session}/>
              ):(
                logOut()
              )
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
