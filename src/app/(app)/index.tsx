import { View, Text, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

// Mock Safety Pins
const MOCK_PINS = [
  { id: '1', title: 'Suspicious Activity', lat: 37.78825, lng: -122.4324, type: 'dangerous', color: '#f43f5e' },
  { id: '2', title: 'Poor Lighting', lat: 37.78925, lng: -122.4344, type: 'unpleasant', color: '#f59e0b' },
  { id: '3', title: 'Safe Route Verified', lat: 37.78725, lng: -122.4314, type: 'safe', color: '#10b981' },
];

export default function HomeMap() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  return (
    <View className='flex-1 bg-violet-50 dark:bg-violet-950 relative'>
      <MapView 
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {MOCK_PINS.map(pin => (
          <Marker 
            key={pin.id}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            title={pin.title}
            pinColor={pin.color}
          />
        ))}
      </MapView>
      
      <View className='absolute bottom-6 w-full px-6 flex-row justify-between items-end'>
        <Pressable className='bg-white dark:bg-violet-800 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-black/20'>
          <FontAwesome5 name="crosshairs" size={20} color={isDark ? "#a78bfa" : "#7c3aed"} />
        </Pressable>
        
        <Pressable 
          onPress={() => setSosActive(!sosActive)}
          className={`w-20 h-20 rounded-full items-center justify-center shadow-lg border-4 ${sosActive ? 'bg-red-600 border-red-300 shadow-red-600/60' : 'bg-red-500 border-red-400/30 shadow-red-500/50'} active:bg-red-700`}
        >
          <Text className='text-white font-black text-xl'>{sosActive ? 'ACTIVE' : 'SOS'}</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => setModalVisible(true)}
          className='bg-violet-600 active:bg-violet-700 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-violet-500/40'
        >
          <FontAwesome5 name="plus" size={20} color="white" />
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white dark:bg-violet-900 rounded-t-3xl p-6 shadow-2xl h-2/3">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-violet-950 dark:text-white">Report Hazard</Text>
              <Pressable onPress={() => setModalVisible(false)} className="p-2 bg-violet-100 dark:bg-violet-800 rounded-full">
                <FontAwesome5 name="times" size={20} color={isDark ? "#c4b5fd" : "#6d28d9"} />
              </Pressable>
            </View>
            
            <Text className="text-sm font-semibold text-violet-600 dark:text-violet-300 uppercase mb-3">Severity</Text>
            <View className="flex-row justify-between mb-6">
              <Pressable className="flex-1 bg-green-100 dark:bg-green-900/40 p-3 rounded-xl mr-2 items-center border border-green-200 dark:border-green-800">
                <Text className="font-bold text-green-700 dark:text-green-400">Safe</Text>
              </Pressable>
              <Pressable className="flex-1 bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl mr-2 items-center border border-amber-200 dark:border-amber-800">
                <Text className="font-bold text-amber-700 dark:text-amber-400">Unpleasant</Text>
              </Pressable>
              <Pressable className="flex-1 bg-red-100 dark:bg-red-900/40 p-3 rounded-xl items-center border border-red-200 dark:border-red-800">
                <Text className="font-bold text-red-700 dark:text-red-400">Dangerous</Text>
              </Pressable>
            </View>
            
            <Text className="text-sm font-semibold text-violet-600 dark:text-violet-300 uppercase mb-3">Details</Text>
            <TextInput 
              className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-violet-900 dark:text-white h-32 text-left align-top"
              placeholder="What did you see or experience?"
              placeholderTextColor={isDark ? "#8b5cf6" : "#a78bfa"}
              multiline
            />
            
            <Pressable 
              className="bg-violet-600 p-4 rounded-2xl mt-auto items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold text-lg">Drop Pin</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
