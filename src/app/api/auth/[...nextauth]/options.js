import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import DbConnect from "../../v1/utils";
import { loginUser } from "../../v1/controller/user/route";

const authOptions={
    session:{
        strategy:'jwt',
        maxAge: 600*60

    },
    providers:[
        CredentialsProvider({
            type:'credentials',
            credentials:{username:{},password:{}},
            async authorize(credentials,request){

                let userData
                
                if (typeof credentials !=='undefined') {

                    await DbConnect();

                    userData=await loginUser(credentials.username,credentials.password,request)
                }
                else{
                    throw new Error('Invalid credentials')
                }

                if (!userData.success) {
                    throw new Error(userData.message)
                }

                
                return {
                    id:userData.user.id,
                    access:userData.access,
                    name:userData.user.firstName+' '+userData.user.lastName,
                    email:userData.butchery.email,
                    butcheryName:userData.butchery.name,
                    branch:userData.user.branch,
                    package:userData.branch.subscription.package,
                    branchName:userData.branch.name
                }

            }
        })
        
    ],
    // database:process.env.DB_URL,
    pages:{
        signIn:'/login',
        signOut:'/'
    },
    callbacks:{
        async jwt({token,user}){

            if(user){
                token.id=user.id
                token.access=user.access
                token.name=user.name
                token.email=user.email
                token.branch=user.branch
                token.butcheryName=user.butcheryName
                token.branchName=user.branchName
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user.id=token.id
                session.user.access=token.access
                session.user.name=token.name
                session.user.email=token.email
                session.user.branch=token.branch
                session.user.butcheryName=token.butcheryName
                session.user.branchName=token.branchName
            }
            return session
        }

    }
    
}

export default authOptions