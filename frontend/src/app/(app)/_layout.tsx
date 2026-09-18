import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import ThemeToggle from '../../components/ThemeToggle';
import { useColorScheme } from 'nativewind';

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs screenOptions={{ 
      headerShown: true, 
      headerStyle: {
        backgroundColor: isDark ? '#2e1065' : '#f5f3ff',
      },
      headerTintColor: isDark ? '#ddd6fe' : '#4c1d95',
      headerRight: () => <ThemeToggle />,
      tabBarActiveTintColor: isDark ? '#a78bfa' : '#7c3aed',
      tabBarInactiveTintColor: isDark ? '#6d28d9' : '#c4b5fd',
      tabBarStyle: {
        backgroundColor: isDark ? '#2e1065' : '#f5f3ff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }}>
      <Tabs.Screen 
        name='index' 
        options={{ 
          title: 'Home Map',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="map-marked-alt" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name='route-planner' 
        options={{ 
          title: 'Route Planner',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="route" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name='community' 
        options={{ 
          title: 'Community Feed',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dynamic-feed" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name='profile' 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-alt" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}
