//import { Image } from 'expo-image';
import { StyleSheet, Switch, TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myStyles } from '@/constants/stylesheet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function AddSeriesScreen() {
    // Initialize SQLite database connection
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    // Router for navigation
    const router = useRouter();

    // State to hold the new series name
    const [name, setName] = useState('');
    const [author, setAuthor] = useState<number>();

    // State to hold the list of authors for dropdown selection
    const [authors, setAuthors] = useState<schema.Author[]>([]);

      // Function to fetch authors from the database
      const getAuthors = async () => {
          try {
            const fetchedAuthors = await drizzleDb.select().from(schema.author).all();
            setAuthors(fetchedAuthors);
          } catch (error) {
            console.error('Error fetching books:', error);
          }
        };
      

    // Function to add a new series to the database
    const addSeries = () => {
        const seriesData: schema.NewSeries = {
            name: name,
            author_id: author,
        };
        try {
                drizzleDb.insert(schema.series).values(seriesData).run();
                        setName('');
                        setAuthor(undefined);
                        router.back();
                    } catch (error) {
                      console.error(error);
                      alert('Failed to add series');
                    }
    }


    // Fetch authors when the component is focused
    useFocusEffect(
        useCallback(() => {
        getAuthors();
        }, [])
    );


    return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* Title Section */}
            <ThemedView className='py-2' style={styles.titleContainer}>
                <ThemedText type="title">Add a New Series</ThemedText>
            </ThemedView>

            {/* Form to add a new series */}
            <ThemedView style={styles.formContainer}>

                {/* Input field for the series name */}
                <TextInput
                placeholder="Enter Series Name"
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
                style={[styles.input]}
                />

                {/* Dropdown to select the author */}
                <View style={[styles.pickerRow]}>
                  <Picker
                  selectedValue={author}
                  onValueChange={(itemValue) => setAuthor(itemValue)}
                  style={[styles.picker]}
                  itemStyle={[styles.pickeritem]}
                  >
                      {/* 1) default option */}
                      <Picker.Item
                          key="default"
                          label={authors.length === 0 ? 'No authors found' : 'Select author'}
                          value={null}
                          enabled={authors.length > 0}
                          color={authors.length === 0 ? '#888' : undefined}
                      />

                      {/* 2) if we have authors, map them out */}
                      {authors.map((a) => (
                          <Picker.Item
                          key={a.id}
                          label={a.name}
                          value={a.id}
                          />
                      ))}
                  </Picker>
                </View>

                {/* Button to submit the new sereis */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity style={[myStyles.button]} onPress={addSeries} >
                    <Text style={[myStyles.buttonText]}>
                      Add Series
                    </Text>
                  </TouchableOpacity>
                </View>


                {/* {authors.map((author) => (
                                <Text style= {{ color: 'red'}}>
                                {author.name} - {author.id}
                                </Text>
                            ))} */}

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
    backgroundColor: 'darkred',
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
    color: '#fff',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#505050'
  },
  picker: {
    //borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    marginVertical: 1,
    height: 80,
    color: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pickeritem: {
    height: 80,
    fontSize: 16,
    color: 'white',
    width: '100%',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginVertical: 1,
    paddingHorizontal: 10,
    height: 80,
    backgroundColor: '#505050',
    width: '100%',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
