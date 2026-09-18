import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const ALERTS = [
  { id: '1', title: 'Suspicious Activity Reported', location: '2 blocks away', time: '10 mins ago', type: 'warning' },
  { id: '2', title: 'Street Light Outage Fixed', location: 'Oak Street', time: '2 hours ago', type: 'success' },
];

const CONTACTS = [
  { id: '1', name: 'Mom', relation: 'Family', phone: '(555) 123-4567' },
  { id: '2', name: 'John (Roommate)', relation: 'Friend', phone: '(555) 987-6543' },
];

export default function CommunityFeed() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className='flex-1 bg-violet-50 dark:bg-violet-950 px-4'>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View className='mt-4 mb-6'>
          <Text className='text-violet-950 dark:text-white text-3xl font-extrabold tracking-tight mb-4'>Emergency Contacts</Text>
          
          {CONTACTS.map(contact => (
            <View key={contact.id} className='bg-white dark:bg-violet-900/60 rounded-2xl p-4 border border-violet-100 dark:border-violet-800 shadow-sm mb-3 flex-row justify-between items-center'>
              <View className='flex-row items-center'>
                <View className='bg-violet-100 dark:bg-violet-800 w-12 h-12 rounded-full items-center justify-center mr-4'>
                  <Text className='text-violet-700 dark:text-violet-300 font-bold text-lg'>{contact.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text className='text-violet-900 dark:text-white text-lg font-bold'>{contact.name}</Text>
                  <Text className='text-violet-500 dark:text-violet-400'>{contact.relation}</Text>
                </View>
              </View>
              <Pressable className='bg-green-100 dark:bg-green-900/40 p-3 rounded-full'>
                <FontAwesome5 name="phone-alt" size={16} color={isDark ? "#4ade80" : "#16a34a"} />
              </Pressable>
            </View>
          ))}
          
          <Pressable className='bg-violet-100 dark:bg-violet-800 border border-dashed border-violet-400 dark:border-violet-600 rounded-2xl p-4 items-center mt-2'>
            <Text className='text-violet-600 dark:text-violet-300 font-bold'>+ Add Trusted Contact</Text>
          </Pressable>
        </View>

        <View className='mb-8'>
          <View className='flex-row justify-between items-end mb-4'>
            <Text className='text-violet-950 dark:text-white text-3xl font-extrabold tracking-tight'>Local Alerts</Text>
            <Text className='text-violet-600 dark:text-violet-400 font-bold'>View Map</Text>
          </View>
          
          {ALERTS.map(alert => (
            <View key={alert.id} className='bg-white dark:bg-violet-900/60 rounded-2xl p-4 border border-violet-100 dark:border-violet-800 shadow-sm mb-3 flex-row items-center'>
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${alert.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
                <FontAwesome5 name={alert.type === 'warning' ? 'exclamation-triangle' : 'check-circle'} size={20} color={alert.type === 'warning' ? '#d97706' : '#16a34a'} />
              </View>
              <View className='flex-1'>
                <Text className='text-violet-900 dark:text-white text-base font-bold'>{alert.title}</Text>
                <Text className='text-violet-600 dark:text-violet-400 text-xs'>{alert.location} • {alert.time}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
