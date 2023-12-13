import { getServerSession } from "next-auth";
import InvoicePage from "../../../../components/sc/invoice/index";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Invoices',
}

export default async function Profile() {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }

  return (
    <>
    {
      session ? (
        <InvoicePage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
