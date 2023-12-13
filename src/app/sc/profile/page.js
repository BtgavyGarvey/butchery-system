import { getServerSession } from "next-auth";
import ProfilePage from "../../../../components/sc/profile/page";
import authOptions from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Profile',
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
        <ProfilePage session={session}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
