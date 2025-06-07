// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Books", headerShown: false }} />
      <Stack.Screen name="updatebook" options={{ title: "Update Book", headerShown: true }} />
    </Stack>
  )
}
