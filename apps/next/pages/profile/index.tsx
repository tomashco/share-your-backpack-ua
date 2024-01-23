import { ProfileScreen } from 'app/features/profile/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <ProfileScreen />
    </>
  )
}
