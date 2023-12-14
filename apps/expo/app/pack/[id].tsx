import { UserDetailScreen } from 'app/features/pack/detail-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Pack',
        }}
      />
      <UserDetailScreen />
    </>
  )
}
