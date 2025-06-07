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
import CustomScrollView from '@/components/CustomScrollView';



export default function ManageGenres() {
  // Initialize the SQLite database and Drizzle ORM
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [loading, setLoading] = useState(false);

  // Router for navigation
  const router = useRouter();

  // State to hold the list of genres
  const [genres, setGenre] = useState<schema.Genre[]>([]);

  // Function to fetch genres from the database
  const getGenres = async () => {
    setLoading(true);
    try {
      const fetchedGenres = await drizzleDb.select().from(schema.genre);
      setGenre(fetchedGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
    // Fetch genres when the component is focused
    useFocusEffect(
      useCallback(() => {
        getGenres();
      }, [])
    );



  return (
    //<SafeAreaView>
      //<ScrollView style={{ paddingHorizontal: 16, height: '100%' }}>
      <CustomScrollView>
        <View style={{ height: 80 }} />

        {/* Title Section */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText 
            style={{ fontSize: 24, color: 'white' }}
            type="title">
              Manage Genres
          </ThemedText>
        </ThemedView>
        

        {/* Button to add a new genre */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          <TouchableOpacity
            style={myStyles.button}
            onPress={() => {
              try {
                router.push('./(tabs)/(manage)/(add)/addgenre');
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
        <ThemedView style={{ padding: 16, backgroundColor: '#ffffff', borderRadius: 8 }}>
          {genres.length === 0 ? (
          <ThemedText
          style={{ flexDirection: 'row', borderRadius: 10, marginVertical:5, padding: 8, backgroundColor: '#151515' }}
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

              {/* action buttons */}
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>

                {/* Button to update the record */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={() => router.push(`./(update)/updategenre?id=${genre.id}`)}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Update
                  </ThemedText>
                </TouchableOpacity>

                {/* Button to delete the record */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={async () => {
                    setLoading(true);
                    try {
                      await drizzleDb.delete(schema.genre).where(eq(schema.genre.id, genre.id));
                      await getGenres(); 
                    } catch (error) {
                      console.error('Error deleting genre:', error);
                      alert('Failed to delete genre');
                    } finally {
                      setLoading(false);
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

      </CustomScrollView>
      //</ScrollView>
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
