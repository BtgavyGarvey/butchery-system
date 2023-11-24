import { getServerSession } from "next-auth";
import ProfilePage from "../../../../components/sc/profile/page";
import authOptions from "../../api/auth/[...nextauth]/options";

export default async function Profile() {

  const session=await getServerSession(authOptions)

  // console.log(session);
  return (
    <>

    <ProfilePage session={session}/>
    </>
  )
}
