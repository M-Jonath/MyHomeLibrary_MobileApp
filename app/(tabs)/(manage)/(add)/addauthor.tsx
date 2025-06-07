//import { Image } from 'expo-image';
import { StyleSheet, Switch, TextInput, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myStyles } from '@/constants/stylesheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import CustomScrollView from '@/components/CustomScrollView';

export default function AddAuthorScreen() {
    // Initialize SQLite database connection
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });
    const [loading, setLoading] = useState(false);

    // Router for navigation
    const router = useRouter();

    // State to hold the new author's name
    const [author, setAuthor] = useState('');

    // Function to add a new author to the database
    const addAuthor = async() => {
      setLoading(true);
      try {
        await drizzleDb.insert(schema.author).values({name: author});
        setAuthor('');
        router.back();
      } catch (error) {
        console.error(error);
        alert('Failed to add Author');
      } finally {
        setLoading(false);
      }
    }


    return (
      loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00ffcc" />
        </View>
      ) : (
        //<SafeAreaView style={{ flex: 1 }}>

          <CustomScrollView>

            {/* Title Section */}
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Add a New Author</ThemedText>
            </ThemedView>

            {/* Form to add a new author */}
            <ThemedView style={styles.formContainer}>

                {/* Input field for the author's name */}
                <TextInput
                placeholder="Enter Author Name"
                placeholderTextColor="#ccc"
                value={author}
                onChangeText={setAuthor}
                style={[styles.input]}
                />

                {/* Button to submit the new author */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity style={[myStyles.button]} onPressIn={addAuthor} >
                    <Text style={[myStyles.buttonText]}>
                      Add Book
                    </Text>
                  </TouchableOpacity>
                </View>

            </ThemedView>
            
          </CustomScrollView>
        //</SafeAreaView>

    ));
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
  formContainer: {
    gap: 10,
    paddingTop: 20, // additional padding inside the safe area
    paddingBottom: 20,
    paddingHorizontal: 25,
    height: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    marginVertical: 2,
    height: 80,
    color: '#fff',
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
