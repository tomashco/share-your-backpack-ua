import { MyItemsScreen } from 'app/features/myItems/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My Items</title>
      </Head>
      <MyItemsScreen />
    </>
  )
}
