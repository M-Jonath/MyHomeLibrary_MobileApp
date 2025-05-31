import { Stack, Tabs } from 'expo-router';
import React, { Suspense } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';


import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { drizzle } from 'drizzle-orm/expo-sqlite';


export default function ManageNavingation() {

  return (
    <Stack>
        <Stack.Screen name="index" options={{ title: "Manage" }} />
        <Stack.Screen name="authors" options={{ title: "Authors" }} />
        <Stack.Screen name="genres" options={{ title: "Genres" }} />
        <Stack.Screen name="database" options={{ title: "Database" }} />
    </Stack>
  );
}
