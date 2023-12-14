import { redirect } from "next/navigation";
import RegisterPage from "../../../components/register";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/options";

export const metadata = {
  title: 'Butchery System - Register',
}

export default async function Register() {

  const session=await getServerSession(authOptions)

  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }

  return (
    <>
    {
      !session ? (
        <RegisterPage />
      ):(
        toDashboard()
      )
    }
    </>
  )
}
