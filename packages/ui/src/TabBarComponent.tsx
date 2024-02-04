import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { TabNavigationState, ParamListBase, NavigationHelpers } from '@react-navigation/native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import { Home, User2 } from '@tamagui/lucide-icons'
import { Stack, useTheme } from 'tamagui'

export const routes = {
  index: { name: 'Home', icon: (props) => <Home {...props} /> },
  profile: { name: 'Profile', icon: (props) => <User2 {...props} /> },
}
type Props = {
  state: TabNavigationState<ParamListBase>
  descriptors: any
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
  excludedRoutes: string[]
}

const { width } = Dimensions.get('window')

// 20 on each side for absolute positioning of the tab bar
// 20 on each side for the internal padding
const TAB_WIDTH = (width - 40 * 2) / 2

const TabBarComponent = ({ excludedRoutes, state, navigation, descriptors }: Props) => {
  const translateX = useSharedValue(0)
  const focusedTab = state.index
  const theme = useTheme()

  const handleAnimate = (index: number) => {
    'worklet'
    translateX.value = withSpring((index > 1 ? 0 : index) * TAB_WIDTH, {
      duration: 1500,
    })
  }
  useEffect(() => {
    runOnUI(handleAnimate)(focusedTab)
  }, [focusedTab])

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <>
      <Animated.View
        style={[styles.container, rnStyle, { backgroundColor: theme.color10.get() }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              merge: true,
              params: {},
            })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }
        const routeName = route.name as keyof typeof routes

        const Icon = routes[routeName]?.icon
        if (excludedRoutes.includes(routeName)) return <Stack key={`route-${route.name}`} />
        return (
          <Pressable
            key={`route-${route.name}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
          >
            <Icon size={24} color={isFocused ? '$color6' : '$color8'} />
          </Pressable>
        )
      })}
    </>
  )
}

export { TabBarComponent }

const styles = StyleSheet.create({
  container: {
    width: 40, //TAB_WIDTH,
    height: 40,
    zIndex: 0,
    position: 'absolute',
    marginHorizontal: TAB_WIDTH / 2,
    borderRadius: 20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
