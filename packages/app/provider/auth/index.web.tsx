import { ClerkProvider } from '@clerk/nextjs'

const frontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //@ts-ignore
  return <ClerkProvider publishableKey={frontendApi}>{children}</ClerkProvider>
}
