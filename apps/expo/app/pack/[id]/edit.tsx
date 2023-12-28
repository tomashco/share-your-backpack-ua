import { EditPackScreen } from 'app/features/pack/edit-pack'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit',
        }}
      />
      <EditPackScreen />
    </>
  )
}
