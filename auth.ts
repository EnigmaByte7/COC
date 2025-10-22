import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from '@/lib/db'
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(client),
  callbacks:{
    async signIn({user, account, profile}){

      //const userdocid = await checkuser(user)
      
      return true;
    },
    async jwt({user, token}){
      // if(user){
      //   //const userdocid = await checkuser(user)
      //   token.docid = userdocid.id
      if(user){
      token.docId = user.id
      }
      return token;
    },
    async session({token, session}){
      session.user.docId = token.docId as string
      return session
    }
  },
  // logger: {
  //   error(code, metadata) {
  //     console.error(code, metadata)
  //   },
  //   warn(code) {
  //     console.warn(code)
  //   },
  //   debug(code, metadata) {
  //     console.debug(code, metadata)
  //   }
  // },
  session: {
    strategy: "jwt", 
  }, 
  // debug: true
})

export const adapter = MongoDBAdapter(client)