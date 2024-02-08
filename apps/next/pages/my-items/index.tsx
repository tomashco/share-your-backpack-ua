import { MyItemsScreen } from 'app/features/my-items/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Sharepack - My Items</title>
      </Head>
      <MyItemsScreen />
    </>
  )
}