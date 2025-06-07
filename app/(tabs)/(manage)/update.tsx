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
import CustomScrollView from '@/components/CustomScrollView';

export default function UpdateScreen() {

    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });
    const router = useRouter();
    const { type, id } = useLocalSearchParams<{ type: 'Author' | 'Series' | 'Genre'; id: string }>();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');


    const tableMap = {
        Author: schema.author,
        Genre: schema.genre,
        Series: schema.series,
    };


    const getRecord = async () => {
        if (!id || !type || !tableMap[type]) return;
        const recordId = parseInt(id);
        setLoading(true);
        try {
            const results = await drizzleDb
                .select()
                .from(tableMap[type])
                .where(
                    eq(tableMap[type].id, recordId)
                );
            setName(results[0].name);
        } catch(error) {
            console.error(error);
            alert(`Could not load ${type} for updating`)
        } finally {
            setLoading(false)
        }
    };

    const updateRecord = async () => {
      setLoading(true)
      try {
      await drizzleDb
        .update(tableMap[type])
        .set({ name: name })
        .where(
          eq(tableMap[type].id, parseInt(id))
        );
      router.back();
      } catch (error) {
      console.error(error);
      alert(`Failed to update ${type}`);
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
      //<SafeAreaView style = {{ flex: 1 }}>
        
        <CustomScrollView>

          {/* Title Section */}
          <ThemedView style = {styles.titleContainer}>
            <ThemedText type="title"> {`Update ${type}`} </ThemedText>
          </ThemedView>

          {/* Form */}
          <View style = {styles.formContainer}>

            <TextInput
              placeholder = {`Enter ${type} Name`}
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

        </CustomScrollView>

      //</SafeAreaView>
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
