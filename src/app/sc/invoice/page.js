import { getServerSession } from "next-auth";
import InvoicePage from "../../../../components/sc/invoice/index";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function Profile() {

  const session=await getServerSession(authOptions)

  return (
    <>
    <InvoicePage session={session}/>
    </>
  )
}
