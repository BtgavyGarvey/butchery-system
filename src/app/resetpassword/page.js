import { getServerSession } from "next-auth";
import ResetPasswordPage from "../../../components/resetpassword";
import authOptions from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Butchery System - Reset Password',
}

export default async function ResetPassword() {

  const session=await getServerSession(authOptions)

  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }

  return (
    <>
    {
      !session ? (
        <ResetPasswordPage />
      ):(
        toDashboard()
      )
    }
    </>
  )
}
