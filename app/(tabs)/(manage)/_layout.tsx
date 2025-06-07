import { Slot, Stack, Tabs } from 'expo-router';
import React, { Suspense } from 'react';
import { View } from 'react-native';



export default function ManageNavigation() {

  return (
      <View style={{ flex:1 }} >
        <Stack>
            <Stack.Screen name="index" options={{ title: "Manage Home", headerShown: false }} />
            <Stack.Screen name="authors" options={{ title: "Manage Authors" }} />
            <Stack.Screen name="series" options={{ title: "Manage Series" }} />
            <Stack.Screen name="genres" options={{ title: "Manage Genres" }} />
            <Stack.Screen name="database" options={{ title: "Database" }} />
            <Stack.Screen name="(add)/addauthor" options={{ title: "Add Author" }} />
            <Stack.Screen name="(add)/addseries" options={{ title: "Add Series" }} />
            <Stack.Screen name="(add)/addgenre" options={{ title: "Add Genre" }} />
            <Stack.Screen
              name="update"
              options={({
                route,
              }: {
                route: { params?: { type?: string } };
              }) => ({
                title: `Update ${route.params?.type ?? ''}`,
              })}
            />
        </Stack>
        {/* <Slot /> */}
      </View>
      // <View style={{ flex: 1 }}>
      //   <Slot />
      // </View>
  );
}
