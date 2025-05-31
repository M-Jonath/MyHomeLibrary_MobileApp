import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { myStyles } from '@/constants/stylesheet';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ManageGenres() {
  // Initialize the SQLite database and Drizzle ORM
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // Router for navigation
  const router = useRouter();

  // State to hold the list of authors
  const [genres, setGenre] = useState<schema.Genre[]>([]);

  // Function to fetch authors from the database
  const getGenres = async () => {
      try {
        const fetchedGenres = await drizzleDb.select().from(schema.genre).all();
        setGenre(fetchedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
  
  
    // Fetch authors when the component is focused
    useFocusEffect(
      useCallback(() => {
        getGenres();
      }, [])
    );



  return (
    //<SafeAreaView>
      <ScrollView style={{ paddingHorizontal: 16, height: '100%' }}>

        {/* Title Section */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText 
            style={{ fontSize: 24, color: 'white' }}
            type="title">
              Manage Genres
          </ThemedText>
        </ThemedView>
        

        {/* Button to add a new author */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          <TouchableOpacity
            style={myStyles.button}
            onPress={() => {
              try {
                router.push('/(tabs)/(manage)/addgenre');
              } catch (error) {
                console.error('Error navigating to addgenre:', error);
              }
            }}
          >
            <ThemedText 
              style={[myStyles.buttonText]}
              type="defaultSemiBold">
              Add New Genre
            </ThemedText>
          </TouchableOpacity>
        </View>
        

        {/* Displaying the list of genres */}
        <ThemedView style={{ padding: 16, backgroundColor: 'black', borderRadius: 8 }}>
          {genres.length === 0 ? (
          <ThemedText
          style={{ flexDirection: 'row', borderRadius: 5, marginVertical:5, padding: 8, backgroundColor: '#202020' }}
          >No Genres found</ThemedText>
          ) : (
          genres.map((genre) => (
            <View 
              key={genre.id} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between', 
                borderRadius: 5, 
                marginVertical:5, 
                padding: 8, 
                backgroundColor: '#202020' }}>
              
              {/* Displaying the genre name */}
                <ThemedText
                style={ { fontSize: 16, color: 'white', flex: 1} }>
                  {genre.name}
                </ThemedText>

              {/* action buttons for each genre */}
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>

                {/* Button to update the genre */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={() => router.push(`./updategenre?id=${genre.id}`)}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Update
                  </ThemedText>
                </TouchableOpacity>

                {/* Button to delete the genre */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={async () => {
                    try {
                      await drizzleDb.delete(schema.genre).where(eq(schema.genre.id, genre.id)).run();
                      await getGenres(); 
                    } catch (error) {
                      console.error('Error deleting genre:', error);
                      alert('Failed to delete genre');
                    }
                  }}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Delete
                  </ThemedText>
                </TouchableOpacity>
              </View>

            </View>
          ))
        )}
        </ThemedView>

      </ScrollView>
    //</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black',
    borderRadius: 8,
  },
});
