import { StyleSheet, TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myStyles } from '@/constants/stylesheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useCallback, useState } from 'react';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { eq } from 'drizzle-orm';

export default function UpdateGenreScreen() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [genre, setGenre] = useState('');

  // Fetch existing genre on mount
  useFocusEffect(
    useCallback(() => {
        let isActive = true;

        const fetchGenre = async () => {
        if (!id) return;
        const genreId = parseInt(id);
        const results = await drizzleDb
            .select()
            .from(schema.genre)
            .where(eq(schema.genre.id, genreId))
            .all();

        if (isActive) {
            if (results.length === 1) {
            setGenre(results[0].name);
            } else if (results.length > 1) {
            console.error('Multiple genres found with the same ID');
            alert('Error: Multiple genres found with the same ID');
            router.back();
            } else {
            alert('Genre not found');
            router.back();
            }
        }
        };

        fetchGenre();

        // Cleanup
        return () => {
        isActive = false;
        };
    }, [id])
    );


  const updateGenre = () => {
    try {
      drizzleDb
        .update(schema.genre)
        .set({ name: genre })
        .where(eq(schema.genre.id, parseInt(id)))
        .run();
      router.back();
    } catch (error) {
      console.error(error);
      alert('Failed to update Genre');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title Section */}
        <ThemedView className="py-2" style={styles.titleContainer}>
          <ThemedText type="title">Update Genre</ThemedText>
        </ThemedView>

        {/* Form */}
        <ThemedView style={styles.formContainer}>
          <TextInput
            placeholder="Enter Genre Name"
            placeholderTextColor="#ccc"
            value={genre}
            onChangeText={setGenre}
            style={[styles.input]}
          />

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={[myStyles.button]} onPress={updateGenre}>
              <Text style={[myStyles.buttonText]}>Update Genre</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 20,
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
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#151515'
  },
});
