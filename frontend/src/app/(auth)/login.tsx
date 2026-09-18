import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });
      
      if (isSignedIn) {
        router.replace('/(app)');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        router.push({ pathname: '/(auth)/verify', params: { email } });
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  return (
    <SafeAreaView className='flex-1 bg-violet-950'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 justify-center px-6'
      >
        <View className='items-center mb-12'>
          <View className='w-24 h-24 bg-violet-600 rounded-full items-center justify-center mb-6 shadow-lg shadow-violet-500/50'>
            <FontAwesome5 name="shield-alt" size={40} color="white" />
          </View>
          <Text className='text-white text-4xl font-extrabold tracking-tight mb-2'>SafeRoute</Text>
          <Text className='text-violet-300 text-base text-center'>Community-powered safety navigation</Text>
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
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className='text-white text-lg font-bold'>Sign In</Text>
          )}
        </Pressable>
        
        <Pressable 
          className='bg-white active:bg-gray-200 py-4 rounded-2xl flex-row justify-center items-center shadow-lg mb-4'
          onPress={handleGoogleSignIn}
        >
          <FontAwesome5 name="google" size={18} color="#db4437" className='mr-3' />
          <Text className='text-gray-800 text-lg font-bold ml-2'>Sign In with Google</Text>
        </Pressable>
        
        <View className='flex-row justify-center mt-4'>
          <Text className='text-violet-300'>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text className='text-violet-400 font-bold'>Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
