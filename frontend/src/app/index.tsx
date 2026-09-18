import { Redirect } from 'expo-router';

export default function Index() {
  // For Sprint 1, we start at the login screen
  return <Redirect href="/(auth)/login" />;
}
