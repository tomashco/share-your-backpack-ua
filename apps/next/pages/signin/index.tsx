import { SignInWithOAuthScreen } from 'app/features/signinoauth/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Sharepack - Sign In</title>
      </Head>
      <SignInWithOAuthScreen />
    </>
  )
}
