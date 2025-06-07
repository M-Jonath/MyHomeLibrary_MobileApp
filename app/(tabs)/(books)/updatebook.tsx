import { StyleSheet, TextInput, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');



    const getRecord = async () => {
        if (!id ) return;
        const recordId = parseInt(id);
        setLoading(true);
        try {
            const results = await drizzleDb
                .select()
                .from(schema.book)
                .where(
                    eq(schema.book.id, recordId)
                );
            setName(results[0].title);
            setLoading(false);
        } catch(error) {
            console.error(error);
            alert('Could not load book for updating')
        } finally {
            setLoading(false)
        }
    };

    const updateRecord = async () => {
        setLoading(true)
        try {
            await drizzleDb
                .update(schema.book)
                .set({ title: name })
                .where(
                    eq(schema.book.id, parseInt(id))
                );
            router.back();
        } catch (error) {
            console.error(error);
            alert('Failed to update book');
        } finally {
            setLoading(false);
        }
    };

    // Fetch existing genre on mount
    useFocusEffect(
        useCallback(() => {
            getRecord();
        }, [])
    );

  return (
    loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00ffcc" />
          </View>
        ) : (
      <SafeAreaView style = {{ flex: 1 }}>
        
        <ScrollView contentContainerStyle = {styles.scrollContainer}>

          {/* Title Section */}
          <ThemedView style = {styles.titleContainer}>
            <ThemedText type="title"> Update Book </ThemedText>
          </ThemedView>

          {/* Form */}
          <View style = {styles.formContainer}>

            <TextInput
              placeholder = {`Enter Title`}
              placeholderTextColor = "white"
              value = {name}
              onChangeText = {setName}
              style = {[styles.input]}
            />

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={[myStyles.button]} onPressIn={updateRecord}>
                <Text style={[myStyles.buttonText]}>Update</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>

      </SafeAreaView>
    )
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
