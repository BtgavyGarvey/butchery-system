import { getServerSession } from "next-auth";
import MakeSalesPage from "../../../../../../components/sc/products/sales/makesales";
import authOptions from "../../../../api/auth/[...nextauth]/options";
import { getProducts } from "../../../../api/v1/controller/butchery/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - New Sales',
}

export default async function MakeSales() {

  const session=await getServerSession(authOptions)
  let response
  let data={
    page:0,
    pageLimit:1000,
    branch:session?.user.branch,
    searchParams:'all',
    value:1
  }
  
  response=await getProducts(data)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <MakeSalesPage session={session} data={response}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
