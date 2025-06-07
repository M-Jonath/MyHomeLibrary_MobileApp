import { myStyles } from '@/constants/stylesheet';
import { Slot, Stack, Tabs } from 'expo-router';
import React, { Suspense } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ManageNavigation() {

  return (
    <SafeAreaView style= {{ flex: 1}}>
      <View style={{ flex: 1 }}>
         {/* add book button */}
        {/* <View style={{ alignItems: "center" }}>
          <TouchableOpacity 
            style={[myStyles.button, {width: 'auto', marginRight: 'auto', marginLeft: 10, marginTop: '10%'}]} 
            //onPress={} 
           >
            <Text style={[myStyles.buttonText]}>
            Back
            </Text>
          </TouchableOpacity>
        </View> */}
        {/* <Slot /> */}
        <Stack>
            <Stack.Screen name="index" options={{ title: "Manage" }} />
            <Stack.Screen name="authors" options={{ title: "Authors" }} />
            <Stack.Screen name="genres" options={{ title: "Genres" }} />
            <Stack.Screen name="database" options={{ title: "Database" }} />
            <Stack.Screen name="(add)" options={{ title: "add" }} />
        </Stack>
      </View>
    </SafeAreaView>
  );
}
