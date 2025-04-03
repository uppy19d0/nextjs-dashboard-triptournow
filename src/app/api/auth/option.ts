import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDictionary } from '@/locales/dictionary'
import { apiService } from '@/app/api/services/apis' // Asegúrate de importar apiService correctamente

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, user: { ...(user as User) } }
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: token.user };
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'string' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const { username, password } = credentials

        try {
          const data = await apiService.post<{
            status: string;
            user: { firstName: string; lastName: string; email: string };
            token: string;
          }>('/login', { email: username, password })

          if (data.status === 'success') {
            return {
              id: 1,
              name: `${data.user.firstName} ${data.user.lastName}`,
              username: 'Username',
              email: data.user.email,
              avatar: '/assets/img/avatars/8.jpg',
              token: data.token,
            }
          }
          const dict = await getDictionary()
          throw new Error(
            dict.login.message.auth_failed || 'Invalid credentials',
          )
        } catch (error) {
          console.error('Login error:', error)
          throw new Error('Failed to authenticate')
        }
      },
    }),
  ],
}
