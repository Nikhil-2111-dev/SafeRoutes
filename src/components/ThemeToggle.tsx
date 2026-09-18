import { Pressable, Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable 
      onPress={toggleColorScheme} 
      className="p-2 mr-4 bg-violet-200 dark:bg-violet-800 rounded-full shadow-sm"
    >
      <FontAwesome5 
        name={colorScheme === 'dark' ? 'sun' : 'moon'} 
        size={18} 
        color={colorScheme === 'dark' ? '#fde047' : '#4c1d95'} 
      />
    </Pressable>
  );
}
