import { Image } from 'expo-image';
import { ActivityIndicator, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { myStyles } from '@/constants/stylesheet';
import { use, useCallback, useState } from 'react';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq, or, sql } from 'drizzle-orm';
import { useFocusEffect, useRouter } from 'expo-router';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function SearchScreen() {

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<schema.BookWithDetails[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const getSearchResults = async () => {
    setLoading(true);
    try {
      const results = await drizzleDb
        .select()
        .from(schema.book)
        .leftJoin(schema.author, eq(schema.book.author_id, schema.author.id))
        .leftJoin(schema.series, eq(schema.book.series_id, schema.series.id))
        .leftJoin(schema.genre, eq(schema.book.author_id, schema.genre.id))
        .where(or(
          sql`${schema.book.title} LIKE ${`%${searchText}%`}`,
          sql`${schema.author.name} LIKE ${`%${searchText}%`}`,
          sql`${schema.series.name} LIKE ${`%${searchText}%`}`,
          sql`${schema.genre.name} LIKE ${`%${searchText}%`}`
        ));  
      // The structure of `results` will look like:
      // [{ book: {...}, author: {...}, series: {...}, genre: {...} }]
      setSearchResults(
        results.map(({ book, author, series, genre }) => ({
          book,
          author: author ?? undefined,
          series: series ?? undefined,
          genre: genre ?? undefined,
        }))
      );
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      // reset search state when the screen is focused
      setSearchText('');
      setSearchResults([]);
      setHasSearched(false);
    }, [])
  );


  

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="1.magnifyingglass"
          style={styles.headerImage}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Search</ThemedText>
      </ThemedView>

      
      <View 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'space-between', 
          borderRadius: 5, 
          marginVertical:5, 
          padding: 8, 
          backgroundColor: '#202020' }}>
              
        {/* Search Input */}
        <View style={{ flex: 1, marginRight: 8 }}>
          <TextInput
            style={{ 
              height: 40, 
              borderColor: '#808080', 
              borderWidth: 1, 
              borderRadius: 5, 
              paddingHorizontal: 8, 
              color: 'white' }}
            placeholder="Search..."
            placeholderTextColor="#808080"
            onChangeText={setSearchText}
            value={searchText}
          />
        </View>

        {/* Search Button */}
        <View style={{ flexDirection: 'row', marginLeft: 8 }}>
            <TouchableOpacity
              style={[myStyles.smallButton, { width: 50 }]}
               onPress={() => {
                setHasSearched(true);
                getSearchResults();
               }}
              >
              <ThemedText 
                style={myStyles.smallButtonText}
                type="defaultSemiBold">
                Search
              </ThemedText>
            </TouchableOpacity>
          </View>
      </View>
      
      
      {/* Results List */}
      {!hasSearched ? (
      <ThemedText>Search by title, author, series or genre</ThemedText>
      ) : (
        loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00ffcc" />
          </View>
        ) : (
        <ThemedView style={{ padding: 16 }}>
          {/* If no books are found, display a message */}
          {searchResults.length === 0 ? (
            <ThemedText>No books maching {searchText} found</ThemedText>
          ) : (
            searchResults.map((b) => (
              // Render each book with its details
              <View key={b.book.id} style={{ marginBottom: 12, backgroundColor: '#202020', padding: 8, borderRadius: 8 }}>
                <ThemedText style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>{b.book.title}</ThemedText>
                <ThemedText style={{ color: 'white' }}>Author: {b.author?.name ?? 'Unknown'}</ThemedText>
                <ThemedText style={{ color: 'white' }}>Series: {b.series?.name ?? 'Unknown'}</ThemedText>
                <ThemedText style={{ color: 'white' }}>Owned: {b.book.owned ? 'Yes' : 'No'}</ThemedText>
                
                {/* action buttons for each genre */}
                <View
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'center', 
                  gap: '10%',
                  borderRadius: 5, 
                  marginVertical:5, 
                  padding: 8, 
                  backgroundColor: '#202020' }}
                >

                  {/* Button to update the book */}
                  <TouchableOpacity
                    disabled={true}
                    style={[myStyles.smallButton, { width: '30%' }]}
                    onPress={() => router.push(`./updategenre?id=${b.book.id}`)}>
                    <ThemedText 
                      style={myStyles.smallButtonText}
                      type="defaultSemiBold">
                      Update
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Button to delete the book */}
                  <TouchableOpacity
                    style={[myStyles.smallButton, { width: '30%' }]}
                    onPress={async () => {
                      try {
                        await drizzleDb.delete(schema.book).where(eq(schema.book.id, b.book.id)).run();
                        await getSearchResults(); 
                      } catch (error) {
                        console.error('Error deleting book:', error);
                        alert('Failed to delete book');
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
        ))
      }



    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
