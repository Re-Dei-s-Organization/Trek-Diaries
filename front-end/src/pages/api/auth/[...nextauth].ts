import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongoDB";

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('Please provide process.env.NEXTAUTH_SECRET env variable.')
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            
          }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password'}
                
            },
            async authorize(credentials) {
                try {
                    const { email, password } = credentials as any
    
                    console.log(`Entered email:${ email }\npassword: ${ password }`)
                    
                    /* check on database here */
                    if (email !== 'hridaya@gmail.com' || password !== '1234') {
                        console.log('Invalid email or password')
                        return null
                    }
    
                    console.log('returning user details')
                    return {
                        id: '1234',
                        name: 'Hridaya',
                        email: 'hridaya@gmail.com',
                        role: 'user'
                    }
                } catch {
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)