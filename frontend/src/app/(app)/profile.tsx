import { View, Text, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

export default function Profile() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className='flex-1 bg-violet-50 dark:bg-violet-950 px-4'>
      <View className='items-center mt-8 mb-8'>
        <View className='w-24 h-24 bg-violet-300 dark:bg-violet-800 rounded-full items-center justify-center mb-4 shadow-lg'>
          <FontAwesome5 name="user-alt" size={40} color={isDark ? "#c4b5fd" : "#6d28d9"} />
        </View>
        <Text className='text-violet-950 dark:text-white text-3xl font-extrabold tracking-tight'>Jane Doe</Text>
        <Text className='text-violet-600 dark:text-violet-400 font-medium'>jane.doe@example.com</Text>
      </View>

      <View className='bg-white dark:bg-violet-900/60 rounded-3xl p-4 border border-violet-100 dark:border-violet-800 shadow-xl mb-6'>
        <View className='flex-row justify-between items-center py-4 border-b border-violet-100 dark:border-violet-700/50'>
          <View className='flex-row items-center'>
            <View className='bg-violet-100 dark:bg-violet-800 p-2 rounded-lg mr-4'>
              <FontAwesome5 name="bell" size={16} color={isDark ? "#c4b5fd" : "#6d28d9"} />
            </View>
            <Text className='text-violet-900 dark:text-white text-lg font-semibold'>Push Notifications</Text>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications} 
            trackColor={{ false: "#d8b4fe", true: "#8b5cf6" }}
            thumbColor="#ffffff"
          />
        </View>
        
        <Pressable className='flex-row justify-between items-center py-4 border-b border-violet-100 dark:border-violet-700/50'>
          <View className='flex-row items-center'>
            <View className='bg-violet-100 dark:bg-violet-800 p-2 rounded-lg mr-4'>
              <FontAwesome5 name="address-book" size={16} color={isDark ? "#c4b5fd" : "#6d28d9"} />
            </View>
            <Text className='text-violet-900 dark:text-white text-lg font-semibold'>Emergency Contacts</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color={isDark ? "#8b5cf6" : "#a78bfa"} />
        </Pressable>

        <Pressable className='flex-row justify-between items-center py-4'>
          <View className='flex-row items-center'>
            <View className='bg-violet-100 dark:bg-violet-800 p-2 rounded-lg mr-4'>
              <FontAwesome5 name="user-shield" size={16} color={isDark ? "#c4b5fd" : "#6d28d9"} />
            </View>
            <Text className='text-violet-900 dark:text-white text-lg font-semibold'>Privacy & Safety</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color={isDark ? "#8b5cf6" : "#a78bfa"} />
        </Pressable>
      </View>

      <Pressable 
        className='bg-red-500/10 dark:bg-red-500/20 active:bg-red-500/20 dark:active:bg-red-500/30 p-4 rounded-2xl items-center flex-row justify-center mt-auto mb-8 border border-red-200 dark:border-red-900'
        onPress={() => router.replace('/(auth)/login')}
      >
        <FontAwesome5 name="sign-out-alt" size={18} color="#ef4444" className='mr-3' />
        <Text className='text-red-500 dark:text-red-400 text-lg font-bold ml-2'>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}
