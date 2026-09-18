import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';

export default function RoutePlanner() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [routeMode, setRouteMode] = useState('safest');

  return (
    <SafeAreaView className='flex-1 bg-violet-50 dark:bg-violet-950 px-4'>
      <View className='flex-row justify-between items-center mt-4 mb-6'>
        <Text className='text-violet-950 dark:text-white text-3xl font-extrabold tracking-tight'>Plan Route</Text>
        <View className='bg-violet-200 dark:bg-violet-800 p-3 rounded-full'>
          <FontAwesome5 name="cog" size={20} color={isDark ? "#c4b5fd" : "#6d28d9"} />
        </View>
      </View>
      
      <View className='bg-white dark:bg-violet-900/60 rounded-3xl p-6 border border-violet-100 dark:border-violet-800 shadow-xl mb-6'>
        <View className='flex-row items-center mb-6'>
          <FontAwesome5 name="map-marker-alt" size={20} color={isDark ? "#a78bfa" : "#8b5cf6"} className='mr-4' />
          <View className='ml-4 border-b border-violet-100 dark:border-violet-700/50 pb-2 flex-1'>
            <Text className='text-violet-500 dark:text-violet-400 text-xs font-semibold uppercase'>Current Location</Text>
            <Text className='text-violet-900 dark:text-white text-lg font-medium'>123 Tech Hub Ave</Text>
          </View>
        </View>
        
        <View className='flex-row items-center'>
          <FontAwesome5 name="bullseye" size={20} color="#f43f5e" className='mr-4' />
          <View className='ml-4 flex-1'>
            <Text className='text-violet-500 dark:text-violet-400 text-xs font-semibold uppercase'>Destination</Text>
            <Text className='text-violet-300 dark:text-violet-200 text-lg font-medium'>Where to?</Text>
          </View>
        </View>
      </View>

      <Text className='text-violet-950 dark:text-white text-xl font-extrabold mb-4'>Route Options</Text>
      
      <View className='flex-row justify-between mb-8 space-x-4'>
        <Pressable 
          onPress={() => setRouteMode('safest')}
          className={`flex-1 p-4 rounded-2xl border-2 items-center ${routeMode === 'safest' ? 'bg-green-50 dark:bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20' : 'bg-white dark:bg-violet-900/40 border-violet-100 dark:border-violet-800'}`}
        >
          <FontAwesome5 name="shield-alt" size={24} color={routeMode === 'safest' ? '#10b981' : (isDark ? '#a78bfa' : '#8b5cf6')} className='mb-2' />
          <Text className={`font-bold text-lg ${routeMode === 'safest' ? 'text-green-700 dark:text-green-400' : 'text-violet-900 dark:text-white'}`}>Safest</Text>
          <Text className={`text-xs ${routeMode === 'safest' ? 'text-green-600 dark:text-green-500' : 'text-violet-500 dark:text-violet-400'}`}>Score: 98/100</Text>
          <Text className={`text-xs mt-1 ${routeMode === 'safest' ? 'text-green-600 dark:text-green-500' : 'text-violet-500 dark:text-violet-400'}`}>15 mins</Text>
        </Pressable>

        <Pressable 
          onPress={() => setRouteMode('fastest')}
          className={`flex-1 p-4 rounded-2xl border-2 items-center ${routeMode === 'fastest' ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-violet-900/40 border-violet-100 dark:border-violet-800'}`}
        >
          <FontAwesome5 name="bolt" size={24} color={routeMode === 'fastest' ? '#f59e0b' : (isDark ? '#a78bfa' : '#8b5cf6')} className='mb-2' />
          <Text className={`font-bold text-lg ${routeMode === 'fastest' ? 'text-amber-700 dark:text-amber-400' : 'text-violet-900 dark:text-white'}`}>Fastest</Text>
          <Text className={`text-xs ${routeMode === 'fastest' ? 'text-amber-600 dark:text-amber-500' : 'text-violet-500 dark:text-violet-400'}`}>Score: 72/100</Text>
          <Text className={`text-xs mt-1 ${routeMode === 'fastest' ? 'text-amber-600 dark:text-amber-500' : 'text-violet-500 dark:text-violet-400'}`}>10 mins</Text>
        </Pressable>
      </View>
      
      <Pressable className='bg-violet-600 active:bg-violet-500 py-4 rounded-2xl items-center shadow-lg shadow-violet-500/30 mt-auto mb-8'>
        <Text className='text-white text-lg font-bold'>Start Navigation</Text>
      </Pressable>
    </SafeAreaView>
  );
}
