import { SignIn } from '@clerk/nextjs'
import SignInOAuthScreen from 'app/features/signinoauth/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Sign In OAuth</title>
      </Head>
      <SignInOAuthScreen />
    </>
  )
}
