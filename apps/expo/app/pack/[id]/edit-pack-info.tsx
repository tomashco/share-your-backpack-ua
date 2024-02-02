import { EditPackInfoScreen } from 'app/features/pack/edit-pack-info'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit',
        }}
      />
      <EditPackInfoScreen />
    </>
  )
}
