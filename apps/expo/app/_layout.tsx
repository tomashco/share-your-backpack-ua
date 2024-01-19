import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from 'app/features/home/screen'
import { ProfileScreen } from 'app/features/profile/screen'
import { SignInWithOAuthScreen } from 'app/features/signinoauth/screen'
import { EditPackScreen } from 'app/features/pack/edit-pack'
import { UserDetailScreen } from 'app/features/pack/detail-screen'
import { TabBar } from '@my/ui/src'

export default function HomeLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const BottomTab = createBottomTabNavigator()

  const excludedRoutes = ['signin', 'signup', 'pack/[id]/edit', 'pack/[id]/index']

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <BottomTab.Navigator
        tabBar={(props) => <TabBar excludedRoutes={excludedRoutes} {...props} />}
      >
        <BottomTab.Screen options={{ headerTitle: 'Home' }} name="index" component={HomeScreen} />
        <BottomTab.Screen
          name="profile"
          options={{ headerTitle: 'Profile' }}
          component={ProfileScreen}
        />
        <BottomTab.Screen
          name={'signin'}
          options={{ headerTitle: 'Sign in' }}
          component={SignInWithOAuthScreen}
        />
        <BottomTab.Screen
          name={'signup'}
          options={{ headerTitle: 'Sign up' }}
          component={SignInWithOAuthScreen}
        />
        <BottomTab.Screen
          name={'pack/[id]/edit'}
          options={{ headerTitle: 'Edit' }}
          component={EditPackScreen}
        />
        <BottomTab.Screen
          name={'pack/[id]/index'}
          options={{ headerTitle: 'Details' }}
          component={UserDetailScreen}
        />
      </BottomTab.Navigator>
      {/* <Tabs
        screenOptions={({ route }) => ({
          headerStyle: {
            height: 80, // Specify the height of your custom header
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'index') {
              return <Home color={focused ? '$color10' : color} />
            } else if (route.name === 'profile') {
              return <User color={focused ? '$color10' : color} />
            }
          },
          // tabBarLabel
          tabBarActiveTintColor: 'gray',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {['signin', 'signup', 'pack/[id]/edit', 'pack/[id]/index'].map((routeToHide) => (
          <Tabs.Screen key={routeToHide} name={routeToHide} options={{ href: null }} />
        ))}
      </Tabs> */}
    </Provider>
  )
}
