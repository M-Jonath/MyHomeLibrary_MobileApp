//import { Image } from 'expo-image';
import { StyleSheet, Switch, TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myStyles } from '@/constants/stylesheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function AddAuthorScreen() {
    // Initialize SQLite database connection
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    // Router for navigation
    const router = useRouter();

    // State to hold the new author's name
    const [genre, setGenre] = useState('');

    // Function to add a new author to the database
    const addGenre = () => {
        try {
              drizzleDb.insert(schema.genre).values({name: genre}).run();
              setGenre('');
              router.back();

            } catch (error) {
              console.error(error);
              alert('Failed to add Genre');
            }
    }


    return (
        //<SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* Title Section */}
            <ThemedView className='py-2' style={styles.titleContainer}>
                <ThemedText type="title">Add a New Genre</ThemedText>
            </ThemedView>

            {/* Form to add a new author */}
            <ThemedView style={styles.formContainer}>

                {/* Input field for the author's name */}
                <TextInput
                placeholder="Enter Genre Name"
                placeholderTextColor="#ccc"
                value={genre}
                onChangeText={setGenre}
                style={[styles.input]}
                />

                {/* Button to submit the new author */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity style={[myStyles.button]} onPress={addGenre} >
                    <Text style={[myStyles.buttonText]}>
                      Add Genre
                    </Text>
                  </TouchableOpacity>
                </View>

            </ThemedView>
            
          </ScrollView>
        //</SafeAreaView>

    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    //backgroundColor: 'darkred',
    height: '100%',
  },
  formContainer: {
    gap: 10,
    paddingTop: 20, // additional padding inside the safe area
    paddingBottom: 20,
    paddingHorizontal: 25,
    height: '100%',
    //backgroundColor: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    marginVertical: 2,
    height: 80,
    backgroundColor: '#151515',
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    marginVertical: 2,
    height: 80,
  },
  pickeritem: {
    height: 80,
    fontSize: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
