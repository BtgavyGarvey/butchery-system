import { getServerSession } from "next-auth";
import InvoicePageById from "../../../../../components/sc/invoice/view/byId";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const metadata = {
  title: 'Butchery System - Invoices',
}

export default async function Profile() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  const {searchParams}=new URL(NextRequest.url)

  console.log(searchParams);


  return (
    <>
    {
      session?.user ? (
        <InvoicePageById session={session} param={searchParams}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
