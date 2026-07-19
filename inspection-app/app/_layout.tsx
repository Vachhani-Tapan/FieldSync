import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SurveyProvider } from '@/context/SurveyContext';
import { useRouter, usePathname } from 'expo-router';

const { Navigator } = createDrawerNavigator();

const Drawer = withLayoutContext<DrawerNavigationOptions, typeof Navigator>(Navigator);

export const unstable_settings = {
  anchor: '(tabs)',
};

function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: 'Dashboard', icon: 'chart.bar.fill', route: '/(tabs)', key: '/(tabs)' },
    { label: 'Survey', icon: 'doc.text.fill', route: '/(tabs)/module2', key: '/(tabs)/module2' },
    { label: 'Camera', icon: 'camera.fill', route: '/(tabs)/module3', key: '/(tabs)/module3' },
    { label: 'Contacts', icon: 'person.2.fill', route: '/(tabs)/module5', key: '/(tabs)/module5' },
    { label: 'Site Location', icon: 'location.fill', route: '/location', key: '/location' },
    { label: 'Clipboard', icon: 'clipboard.fill', route: '/clipboard', key: '/clipboard' },
  ];

  return (
    <DrawerContentScrollView {...props} style={{ flex: 1 }}>
      <View style={s.drawerHeader}>
        <Text style={s.drawerTitle}>FieldSync</Text>
        <Text style={s.drawerSubtitle}>Inspection Suite</Text>
      </View>
      <View style={s.divider} />
      {items.map((item) => {
        const focused = pathname === item.key;
        return (
          <DrawerItem
            key={item.key}
            label={item.label}
            focused={focused}
            activeTintColor={Colors.light.tint}
            icon={({ color, size }) => (
              <IconSymbol size={size || 24} name={item.icon} color={color} />
            )}
            onPress={() => router.navigate(item.route)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

const s = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginBottom: 8,
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SurveyProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              headerShown: false,
            }}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }}
            />
            <Drawer.Screen
              name="location"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#f4f4f4' },
                headerTintColor: '#333',
                title: 'Location',
                drawerItemStyle: { display: 'none' },
              }}
            />
            <Drawer.Screen
              name="clipboard"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#f4f4f4' },
                headerTintColor: '#333',
                title: 'Clipboard',
                drawerItemStyle: { display: 'none' },
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SurveyProvider>
  );
}
