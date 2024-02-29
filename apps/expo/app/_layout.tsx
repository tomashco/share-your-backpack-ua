import { Provider } from 'app/provider'
import { Tabs } from 'expo-router/tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Stack, Text, View } from '@my/ui/src'
import { Home, User2 } from '@tamagui/lucide-icons'

export default function AppLayout() {
  return (
    <Provider>
      <Tabs
        screenOptions={{
          // headerShown: false,
          headerStyle: {},
          tabBarStyle: {},
        }}
      >
        <Tabs.Screen
          options={{
            headerTitle: 'Home',
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <Stack
                  alignItems={'center'}
                  top={8}
                  paddingTop={8}
                  borderTopColor={focused ? '$color6' : '$color8'}
                  borderTopWidth={2}
                >
                  <Home size={24} color={focused ? '$color6' : '$color8'} />
                  <Text fontSize={'$3'} color={focused ? '$color6' : '$color8'}>
                    Home
                  </Text>
                </Stack>
              )
            },
          }}
          name="index"
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <Stack
                  alignItems={'center'}
                  top={8}
                  paddingTop={8}
                  borderTopColor={focused ? '$color6' : '$color8'}
                  borderTopWidth={2}
                >
                  <User2 size={24} color={focused ? '$color6' : '$color8'} />

                  <Text fontSize={'$3'} color={focused ? '$color6' : '$color8'}>
                    Profile
                  </Text>
                </Stack>
              )
            },
          }}
          // component={ProfileScreen}
        />
        <Tabs.Screen
          name={'signin'}
          options={{ headerTitle: 'Sign in', href: null }}
          // component={SignInWithOAuthScreen}
        />
        <Tabs.Screen
          name={'pack/[id]/edit'}
          options={{ headerTitle: 'Edit', href: null }}
          // component={EditPackScreen}
        />
        <Tabs.Screen
          name={'pack/[id]/edit-pack-info'}
          options={{ headerTitle: 'Edit Pack Info', href: null }}
          // component={EditPackInfoScreen}
        />
        <Tabs.Screen
          name={'pack/[id]/index'}
          options={{ headerTitle: 'Details', href: null }}
          // component={UserDetailScreen}
        />
        <Tabs.Screen
          name={'my-gear'}
          options={{ headerTitle: 'My Gear', href: null }}
          // component={MyGearScreen}
        />
        <Tabs.Screen
          name={'my-packs/[authorId]/index'}
          options={{ headerTitle: 'My Packs', href: null }}
          // component={MyPacksScreen}
        />
      </Tabs>
    </Provider>
  )
}
