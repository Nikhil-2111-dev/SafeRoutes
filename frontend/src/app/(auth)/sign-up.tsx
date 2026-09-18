import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          }
        }
      });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        router.push({ pathname: '/(auth)/verify', params: { email } });
      }
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
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
          <Text className='text-white text-4xl font-extrabold tracking-tight mb-2'>Create Account</Text>
          <Text className='text-violet-300 text-base text-center'>Join the safe routing community</Text>
        </View>

        <View className='space-y-4 mb-8'>
          <View className='bg-violet-900/50 rounded-2xl px-4 py-1 border border-violet-800 focus:border-violet-500 transition-colors'>
            <Text className='text-violet-400 text-xs font-semibold mt-2 uppercase tracking-wider'>Email</Text>
            <TextInput 
              className='text-white text-lg py-2'
              placeholder='Enter your email'
              placeholderTextColor='#8b5cf6'
              keyboardType='email-address'
              autoCapitalize='none'
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View className='bg-violet-900/50 rounded-2xl px-4 py-1 border border-violet-800 focus:border-violet-500 transition-colors'>
            <Text className='text-violet-400 text-xs font-semibold mt-2 uppercase tracking-wider'>Password</Text>
            <TextInput 
              className='text-white text-lg py-2'
              placeholder='••••••••'
              placeholderTextColor='#8b5cf6'
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <Pressable 
          className='bg-violet-500 active:bg-violet-600 py-4 rounded-2xl items-center shadow-lg shadow-violet-500/30 mb-4'
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className='text-white text-lg font-bold'>Sign Up</Text>
          )}
        </Pressable>
        
        <View className='flex-row justify-center mt-4'>
          <Text className='text-violet-300'>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text className='text-violet-400 font-bold'>Log In</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
