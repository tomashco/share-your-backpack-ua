import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { TabBarComponent } from './TabBarComponent'
import { useTheme, YStack } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabBar = ({
  excludedRoutes,
  state,
  navigation,
  descriptors,
}: { excludedRoutes: string[] } & BottomTabBarProps) => {
  const theme = useTheme()
  const { top, bottom } = useSafeAreaInsets()
  return (
    <YStack
      bottom={bottom ? bottom : 10}
      style={{ ...styles.tabBarStyle, backgroundColor: theme.color1.get() }}
    >
      <TabBarComponent
        excludedRoutes={excludedRoutes}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </YStack>
  )
}

export { TabBar }

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    left: 20,
    right: 20,
    height: 60,
    flex: 1,
    elevation: 0,
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
})
