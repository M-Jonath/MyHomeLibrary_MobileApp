import { Tabs } from 'expo-router';
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

const dbname = 'mylibrary.db';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Ensure the database is created and opened
  const expoDb = openDatabaseSync(dbname);
  const db = drizzle(expoDb);
  const { success, error} = useMigrations(db, migrations);

  return (
    <Suspense fallback = { <ActivityIndicator size = "large" color = { Colors[colorScheme ?? 'light'].tint } /> } > 
      <SQLiteProvider
        databaseName= { dbname }
        options={{ enableChangeListener: true }}
        useSuspense>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
          }}>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
              }}
            />
            <Tabs.Screen
              name="addBook"
              options={{
                title: 'Add Book',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
              }}
            />
            <Tabs.Screen
              name="(manage)"
              options={{
                title: 'Manage',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="1.magnifyingglass" color={color} />,
              }}
            />
            <Tabs.Screen
              name="search"
              options={{
                title: 'Search',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="1.magnifyingglass" color={color} />,
              }}
            />
        </Tabs>
      </SQLiteProvider>
    </Suspense>
  );
}
