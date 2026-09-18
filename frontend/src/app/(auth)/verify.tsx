import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    setLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      if (isSignUpComplete) {
        Alert.alert('Success', 'Account verified! You can now log in.');
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-violet-950'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 justify-center px-6'
      >
        <View className='items-center mb-12'>
          <Text className='text-white text-4xl font-extrabold tracking-tight mb-2'>Verify Email</Text>
          <Text className='text-violet-300 text-base text-center'>Enter the code sent to {email}</Text>
        </View>

        <View className='space-y-4 mb-8'>
          <View className='bg-violet-900/50 rounded-2xl px-4 py-1 border border-violet-800 focus:border-violet-500 transition-colors'>
            <Text className='text-violet-400 text-xs font-semibold mt-2 uppercase tracking-wider'>Verification Code</Text>
            <TextInput 
              className='text-white text-lg py-2 tracking-widest'
              placeholder='123456'
              placeholderTextColor='#8b5cf6'
              keyboardType='number-pad'
              value={code}
              onChangeText={setCode}
            />
          </View>
        </View>

        <Pressable 
          className='bg-violet-500 active:bg-violet-600 py-4 rounded-2xl items-center shadow-lg shadow-violet-500/30 mb-4'
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className='text-white text-lg font-bold'>Verify Account</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
