import { getServerSession } from "next-auth";
import LandingPage from "../../components/index";
import authOptions from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {

  const session=await getServerSession(authOptions)

  const toDashboard=()=>{
    redirect('/sc/dashboard')
  }

  return (
    <>
    {
      !session ? (
        <LandingPage />
      ):(
        toDashboard()
      )
    }
    </>
  )
}
