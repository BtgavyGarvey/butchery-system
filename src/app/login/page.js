import { redirect } from "next/navigation";
import LoginPage from "../../../components/login";
import authOptions from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const metadata = {
  title: 'Butchery System - Login',
}

export default async function Login() {

  const session=await getServerSession(authOptions)


  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }

  return (
    <>
    {
      !session ? (
        <LoginPage />
      ):(
        toDashboard()
      )
    }
    </>
  )
}
