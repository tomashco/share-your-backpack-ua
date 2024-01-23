import React from 'react'
import { Button, H1, PageLayout, XStack, YStack } from '@my/ui'
import { Header } from 'app/components/header'
import { useLink } from 'solito/link'

export function ProfileScreen() {
  const myItemsLinkProps = useLink({
    href: '/myItems',
  })

  return (
    <PageLayout scrollViewProps={{}}>
      <Header />
      <Button {...myItemsLinkProps} theme={'active'} w={'100%'}>
        My Items
      </Button>
    </PageLayout>
  )
}
