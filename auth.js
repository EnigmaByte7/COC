import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { checkuser } from "./app/actions/firemethods"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks:{
    async signIn({user, account, profile, email}){
      console.log('user : ', user)
      console.log('account : ', account)
      console.log('profile : ', profile)
      console.log('email : ', email)

      const userdocid = await checkuser(user)
      return true;
    },
    async jwt({user, token}){
      if(user){
        const userdocid = await checkuser(user)
        token.docid = userdocid.id
      }

      return token;
    },
    async session({token, session}){
      session.docid = token.docid
      console.log('session' ,session);
      
      return session
    }
  },
  session: {
    strategy: "jwt", 
  },
})