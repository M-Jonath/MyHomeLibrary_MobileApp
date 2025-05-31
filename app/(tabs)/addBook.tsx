//import { Image } from 'expo-image';
import { Button, Platform, StyleSheet, Switch, TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myStyles } from '@/constants/stylesheet';
import { eq, and } from 'drizzle-orm';

//import { HelloWave } from '@/components/HelloWave';
//import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

export default function AddBookScreen() {
    // Initialize SQLite database connection
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const router = useRouter();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState<number | undefined>();
    const [series, setSeries] = useState<number | undefined>();
    const [genre, setGenre] = useState<number | undefined>();
    const [owned, setOwned] = useState(false);

    const [authors, setAuthors] = useState<schema.Author[]>([]);
    const [seriesList, setSeriesList] = useState<schema.Series[]>([]);
    const [genres, setGenres] = useState<schema.Genre[]>([]);

    // State for creating new entries
    const [ createAuthor, setCreateAuthor ] = useState(false);
    const [ createSeries, setCreateSeries ] = useState(false);
    const [ createGenre, setCreateGenre ] = useState(false);

    const [newAuthorName, setNewAuthorName] = useState('');
    const [newSeriesName, setNewSeriesName] = useState('');
    const [newGenreName, setNewGenreName] = useState('');

    // Fuction to get authors list
    const getAuthors = async () => {
        try {
          const fetchedAuthors = await drizzleDb.select().from(schema.author).all();
          setAuthors(fetchedAuthors);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
    };

    // Function to get series list
      const getSeriesList = async () => {
          try {
            const fetchedSeries = await drizzleDb.select().from(schema.series).all();
            setSeriesList(fetchedSeries);
          } catch (error) {
            console.error('Error fetching series:', error);
          }
        };

    // Function to get genres list
    const getGenres = async () => {
          try {
            const fetchedGenres = await drizzleDb.select().from(schema.genre).all();
            setGenres(fetchedGenres);
          } catch (error) {
            console.error('Error fetching genres:', error);
          }
        };

    // Function to toggle author creation mode
    const toggleCreateAuthor = () => {
        setCreateAuthor(!createAuthor);

        if (createAuthor) {
            // Reset the new author name when exiting creation mode
            setNewAuthorName('');
        }
    };

    // Function to toggle series creation mode
    const toggleCreateSeries = () => {
        setCreateSeries(!createSeries);

        if (createSeries) {
            // Reset the new series name when exiting creation mode
            setNewSeriesName('');
        }
    };

    // Function to toggle genre creation mode
    const toggleCreateGenre = () => {
        setCreateGenre(!createGenre);

        if (createGenre) {
            // Reset the new genre name when exiting creation mode
            setNewGenreName('');
        }
    };
    
    // Fetch authors, series, and genres when the component mounts
    // Fetch authors when the component is focused
    useFocusEffect(
      useCallback(() => {
        getAuthors();
        getSeriesList();
        getGenres();
      }, [])
    );





    const addBook = async () => {
        let authorID = author;
        let seriesID = series;
        let genreID = genre;

        // If a new author is being created, insert it into the database
        if (createAuthor && newAuthorName.trim() !== '') {
            console.log('Create New Author Detected:', newAuthorName);
            const newAuthorData: schema.NewAuthor = {
                name: newAuthorName.trim(),
            };
            // Check if the author already exists
            const existingAuthor = await drizzleDb.select().from(schema.author).where(eq(schema.author.name, (newAuthorData.name))).limit(1);
            if (existingAuthor.length > 0) {
              // If the author already exists, set the author ID to the existing author's ID
              console.log('Author already exists:', existingAuthor[0]);
              authorID = existingAuthor[0].id;
            } else {
            try {
              // Insert new author and retrieve the inserted ID
              const newAuthorRow = await drizzleDb.insert(schema.author).values(newAuthorData).returning({ insertedId: schema.author.id}).run();
              // Set the author ID to the newly created author
              console.log('New Author Created:', newAuthorRow);
              console.log('New Author ID:', newAuthorRow.lastInsertRowId);
              authorID = newAuthorRow.lastInsertRowId; 
            } catch (error) {
              console.error('Error adding new author:', error);
              alert('Failed to add author');
              return; // Exit if author creation fails
            }}
        };

        // Does the selected series belong to the selected author?
        if (seriesID && authorID && !createSeries) {
            const seriesCheck = await drizzleDb.select().from(schema.series).where(and(eq(schema.series.id, seriesID), eq(schema.series.author_id, authorID))).limit(1);
            if (seriesCheck.length === 0) {
                console.error('Selected series does not belong to the selected author');
                alert('Selected series does not belong to the selected author');
                return; // Exit if the series does not belong to the author
            }
        }

        // If a new series is being created, insert it into the database
        if (createSeries && newSeriesName.trim() !== '' && authorID) {
            console.log('Create New Series Detected:', newSeriesName);
            const newSeriesData: schema.NewSeries = {
                name: newSeriesName.trim(),
                author_id: authorID
            };
            // Check if the series already exists
            const existingSeries = await drizzleDb.select().from(schema.series).where(and(eq(schema.series.name, newSeriesData.name), eq(schema.series.author_id, authorID))).limit(1);
            if (existingSeries.length > 0) {
              // If the series already exists, set the series ID to the existing series ID
              console.log('Series already exists:', existingSeries[0]);
              seriesID = existingSeries[0].id;
            } else {
            try {
              // Insert new series and retrieve the inserted ID
              const newSeriesRow = await drizzleDb.insert(schema.series).values(newSeriesData).returning({ insertedId: schema.series.id}).run();
              // Set the series ID to the newly created series
              console.log('New Series Created:', newSeriesRow);
              console.log('New Series ID:', newSeriesRow.lastInsertRowId);
              seriesID = newSeriesRow.lastInsertRowId; 
            } catch (error) {
              console.error('Error adding new series:', error);
              alert('Failed to add series');
              return; // Exit if author creation fails
            }}
        };

        // If a new genre is being created, insert it into the database
        if (createGenre && newGenreName.trim() !== '') {
            console.log('Create New Genre Detected:', newGenreName);
            const newGenreData: schema.NewGenre = {
                name: newGenreName.trim(),
            };
            // Check if the genre already exists
            const existingGenre= await drizzleDb.select().from(schema.genre).where(eq(schema.genre.name, (newGenreData.name))).limit(1);
            if (existingGenre.length > 0) {
              // If the genre already exists, set the genre ID to the existing genre's ID
              console.log('Genre already exists:', existingGenre[0]);
              genreID = existingGenre[0].id;
            } else {
            try {
              // Insert new genre and retrieve the inserted ID
              const newGenreRow = await drizzleDb.insert(schema.genre).values(newGenreData).returning({ insertedId: schema.genre.id}).run();
              // Set the author ID to the newly created author
              console.log('New Genre Created:', newGenreRow);
              console.log('New Genre ID:', newGenreRow.lastInsertRowId);
              genreID = newGenreRow.lastInsertRowId; 
            } catch (error) {
              console.error('Error adding new genre:', error);
              alert('Failed to add genre');
              return; // Exit if author creation fails
            }}
        };


        const bookData: schema.NewBook = {
            title: title,
            author_id: authorID,
            series_id: seriesID,
            genre_id: genreID,
            owned: owned ? 1 : 0,
        };



        try {
              console.log('Adding book with data:', bookData);
              const newBookRow = await drizzleDb.insert(schema.book).values(bookData).returning().run();
              setTitle('');
              setAuthor(undefined);
              setSeries(undefined);
              setGenre(undefined);
              setOwned(false);
              setCreateAuthor(false);
              setCreateSeries(false);
              setCreateGenre(false);
              setNewAuthorName('');
              setNewSeriesName('');
              setNewGenreName('');
              
              
              console.log('Book added:', newBookRow);
              alert('Book added!');
              router.push('/'); // Navigate back to the book list
            } catch (error) {
              console.error(error);
              alert('Failed to add book');
            }
    }


    return (
        //<SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollContainer}>

            {/* Title Section */}
            <ThemedView className='py-2' style={styles.titleContainer}>
                <ThemedText type="title">Add a New Book</ThemedText>
            </ThemedView>

            {/* Form Section */}
            <ThemedView style={styles.formContainer}>

                {/*Book Title*/}
                <TextInput
                placeholder="Enter Book Title"
                placeholderTextColor="#ccc"
                value={title}
                onChangeText={setTitle}
                style={[styles.input]}
                />

                {/* Dropdown to select the author */}
                <View style={styles.pickerRow}>
                  <TouchableOpacity 
                    disabled = {true}
                    style={[myStyles.smallButton, { opacity: 0.2, flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
                  </TouchableOpacity>


                  {createAuthor ? (
                    <TextInput
                      placeholder="Enter Author Name"
                      placeholderTextColor="#ccc"
                      value={newAuthorName}
                      onChangeText={setNewAuthorName}
                      style={[styles.createInput]}
                    />
                   ) : (
                  <Picker
                  id='authorSelect'
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
                  )}


                  {/* Add (+) Button */}
                  <TouchableOpacity style={[myStyles.smallButton, { flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]} onPress={toggleCreateAuthor}>
                    <ThemedText style={myStyles.smallButtonText} type="defaultSemiBold">
                      +
                    </ThemedText>
                  </TouchableOpacity>
                </View>


                {/* Dropdown to select the series */}
                <View style={styles.pickerRow}>
                  <TouchableOpacity 
                    disabled = {true}
                    style={[myStyles.smallButton, { opacity: 0.2, flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
                  </TouchableOpacity>

                  { createSeries ? (
                    <TextInput
                      placeholder="Enter Series Name"
                      placeholderTextColor="#ccc"
                      value={newSeriesName}
                      onChangeText={setNewSeriesName}
                      style={[styles.createInput]}
                    />
                  ) : (
                  <Picker
                  selectedValue={series}
                  onValueChange={(itemValue) => setSeries(itemValue)}
                  style={[styles.picker]}
                  itemStyle={[styles.pickeritem]}
                  >
                    {/* 1) default option */}
                    <Picker.Item
                        key="default"
                        label={authors.length === 0 ? 'No Series found' : 'Select Series'}
                        value={null}
                        enabled={authors.length > 0}
                        color={authors.length === 0 ? 'white' : undefined}
                    />

                    {/* 2) if we have series, map them out */}
                    {seriesList.map((a) => (
                      <Picker.Item
                        key={a.id}
                        label={a.name}
                        value={a.id}
                      />
                    ))}
                  </Picker>
                  )}

                  {/* Add (+) Button */}
                  <TouchableOpacity style={[myStyles.smallButton, { flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]} onPress={toggleCreateSeries}>
                    <ThemedText style={myStyles.smallButtonText} type="defaultSemiBold">
                      +
                    </ThemedText>
                  </TouchableOpacity>



                </View>


                {/* Genre Picker Row */}
                <View style={styles.pickerRow}>
                  <TouchableOpacity 
                    disabled = {true}
                    style={[myStyles.smallButton, { opacity: 0.2, flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
                  </TouchableOpacity>

                  { createGenre ? (
                    <TextInput
                      placeholder="Enter Genre Name"
                      placeholderTextColor="#ccc"
                      value={newGenreName}
                      onChangeText={setNewGenreName}
                      style={[styles.createInput]}
                    />
                  ) : (
                  <Picker
                    selectedValue={genre}
                    onValueChange={(itemValue) => setGenre(itemValue)}
                    style={styles.picker}
                    itemStyle={[styles.pickeritem]} 
                  >
                    <Picker.Item
                      key="default"
                      label={authors.length === 0 ? 'No Genre found' : 'Select Genre'}
                      value={null}
                      enabled={authors.length > 0}
                      color={authors.length === 0 ? 'white' : undefined}
                    />
                    {genres.map((a) => (
                      <Picker.Item key={a.id} label={a.name} value={a.id} />
                    ))}
                  </Picker>
                  )}

                  {/* Add (+) Button */}
                  <TouchableOpacity style={[myStyles.smallButton, { flex: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]} onPress={toggleCreateGenre}>
                    <ThemedText style={[myStyles.smallButtonText]} type="defaultSemiBold">
                      +
                    </ThemedText>
                  </TouchableOpacity>
                </View>


                {/* Owned Switch */}
                <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                  <ThemedText style={{color: "white"}}>Owned</ThemedText>
                  <Switch value={owned} onValueChange={setOwned} />
                </View>

                  {/* add book button */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity style={[myStyles.button]} onPress={addBook} >
                    <Text style={[myStyles.buttonText]}>
                      Add Book
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
    backgroundColor: 'blue',
    height: '100%',
  },
  formContainer: {
    gap: 10,
    paddingTop: 20, // additional padding inside the safe area
    paddingBottom: 20,
    paddingHorizontal: 25,
    //height: '100%',
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
    backgroundColor: '#151515',
  },
  picker: {
    //borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    marginVertical: 2,
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginVertical: 2,
    paddingHorizontal: 10,
    height: 80,
    backgroundColor: 'black',
    width: '100%',
  },
  createInput: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 2,
    marginHorizontal: 9,
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#151515',
    height: 40,
    borderRadius: 8,
  },
});

