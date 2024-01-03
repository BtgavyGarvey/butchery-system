import { getServerSession } from "next-auth";
import ResetPasswordPage from "../../../../../components/sc/profile/resetpassword";
import authOptions from "../../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Reset Password',
}

export default async function ResetPassword(request) {

  const session=await getServerSession(authOptions)

  const logOut=()=>{
    redirect('/')
  }
  const {username}=request.searchParams

  return (
    <>
    {
      session ? (
        <ResetPasswordPage session={session} param={request.searchParams}/>
      ):(
        logOut()
      )
    }
    </>
  )
}
