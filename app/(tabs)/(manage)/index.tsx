import { Image } from 'expo-image';
import { Platform, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';

import { myStyles } from '@/constants/stylesheet';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function ManageIndexScreen() {
  const router = useRouter();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>

        {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Manage Authors, Series and Genres</ThemedText>
      </ThemedView>

      {/* Body Section */}
      <View style={[styles.bodyContainer]}>

        {/* Navigation for authors */}
        <TouchableOpacity
          style={myStyles.button}
          onPress={() => {
            console.log('Clicked on Manage Authors');
            router.push('/(tabs)/(manage)/authors');
          }}>
          <ThemedText 
        style={myStyles.buttonText}
        type="defaultSemiBold">Manage Authors</ThemedText>
        </TouchableOpacity>

        {/* Navigation for series */}
        <TouchableOpacity
          style={myStyles.button}
          onPress={() => {
            console.log('Clicked on Manage Series');
            router.push('/(tabs)/(manage)/series');
          }}>
          <ThemedText
        style={myStyles.buttonText}
        type="defaultSemiBold">Manage Series</ThemedText>
        </TouchableOpacity>

        {/* Navigation for genres */}
        <TouchableOpacity
          style={myStyles.button}
          onPress={() => {
            console.log('Clicked on Manage Genre');
            router.push('/(tabs)/(manage)/genres');
          }}>
          <ThemedText
        style={myStyles.buttonText}
        type="defaultSemiBold">Manage Genres</ThemedText>
        </TouchableOpacity>

        {/* Navigation for database */}
        <TouchableOpacity
          style={myStyles.button}
          onPress={() => {
            console.log('Clicked on Manage Database');
            router.push('./database');
          }}>
          <ThemedText
        style={myStyles.buttonText}
        type="defaultSemiBold">Database Management</ThemedText>
        </TouchableOpacity>


      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
});
