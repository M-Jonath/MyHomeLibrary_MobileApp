import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CustomScrollView from '@/components/CustomScrollView';



export default function ManageAuthors() {
  // Initialize the SQLite database and Drizzle ORM
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [loading, setLoading] = useState(false);

  // Router for navigation
  const router = useRouter();

  // State to hold the list of authors
  const [authors, setAuthors] = useState<schema.Author[]>([]);

  // Function to fetch authors from the database
  const getAuthors = async () => {
      setLoading(true);
      try {
        const fetchedAuthors = await drizzleDb.select().from(schema.author);
        setAuthors(fetchedAuthors);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
  
  
    // Fetch authors when the component is focused
    useFocusEffect(
      useCallback(() => {
        getAuthors();
      }, [])
    );



  return (
    loading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    )  :  (
      //<ScrollView style={{ paddingHorizontal: 16 }}>
      <CustomScrollView>
        <View style={{ height: 80 }} />
        {/* Title Section */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText 
            style={{ fontSize: 24, color: 'white' }}
            type="title">
            Manage Authors
          </ThemedText>
        </ThemedView>
        

        {/* Button to add a new author */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          <TouchableOpacity
            style={myStyles.button}
            onPress={() => {
              console.log('Pressed add Author');
              router.push('./(add)/addauthor');
            }}
          >
            <ThemedText 
              style={[myStyles.buttonText]}
              type="defaultSemiBold">
              Add Author
            </ThemedText>
          </TouchableOpacity>
        </View>
        

        {/* Displaying the list of authors */}
        <ThemedView style={{ padding: 16, borderRadius: 8 }}>
          {authors.length === 0 ? (
          <ThemedText
          style={{ flexDirection: 'row', borderRadius: 5, marginVertical:5, padding: 8, backgroundColor: '#202020' }}
          >No Authors found</ThemedText>
          ) : (
          authors.map((author) => (
            <View key={author.id} style={{ flexDirection: 'row', borderRadius: 10, marginVertical:5, padding: 8, backgroundColor: '#252525' }}>
              
              { /* Display Author Name */ }
              <ThemedText
              style={ { fontSize: 16, color: 'white', flex: 1 } }>
                {author.name}
              </ThemedText>

              {/* action buttons */}
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>

                {/* Button to update record */}
                <TouchableOpacity
                  disabled={true}
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={() => router.push(`./updategenre?id=${author.id}`)}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Update
                  </ThemedText>
                </TouchableOpacity>

                {/* Button to delete record */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPress={async () => {
                    setLoading(true);
                    try {
                      await drizzleDb.delete(schema.author).where(eq(schema.author.id, author.id));
                      await getAuthors(); 
                    } catch (error) {
                      console.error('Error deleting author:', error);
                      alert('Failed to delete author');
                    } finally {
                      setLoading(false)
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
  ));
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
