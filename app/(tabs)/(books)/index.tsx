import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { myStyles } from '@/constants/stylesheet';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // Initialize SQLite database connection
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [loading, setLoading] = useState(false);


  // State to hold books with details
  const [booksWithDetails, setBooksWithDetails] = useState<schema.BookWithDetails[]>([]);
  const [ownedStates, setOwnedStates] = useState<Record<number, boolean>>({});


  const router = useRouter();

  const getBooksWithDetails = async () => {
    setLoading(true);
    try {
      const results = await drizzleDb
        .select()
        .from(schema.book)
        .leftJoin(schema.author, eq(schema.book.author_id, schema.author.id))
        .leftJoin(schema.series, eq(schema.book.series_id, schema.series.id))
        .leftJoin(schema.genre, eq(schema.book.author_id, schema.genre.id));

      // Artificial delay
      //await new Promise(resolve => setTimeout(resolve, 500));

      // The structure of `results` will look like:
      // [{ book: {...}, author: {...}, series: {...}, genre: {...} }]
      console.log(results)
      
      setBooksWithDetails(
        results.map(({ book, author, series, genre }) => ({
          book,
          author: author ?? undefined,
          series: series ?? undefined,
          genre: genre ?? undefined,
        }))
      );
      
      const OwnedMap = Object.fromEntries (
        results.map(({book}) => ([book.id, book.owned===1]))
      ) as Record<number,boolean>;
      setOwnedStates(OwnedMap);
      
    } catch (error) {
      console.error('Error fetching books with details:', error);
      alert(`Error fetching books with details: ${error}`)
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    setLoading(true);
    try {
      await drizzleDb.delete(schema.book).where(eq(schema.book.id, id));
      await getBooksWithDetails(); 
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    } finally {
      setLoading(false);
    }               
  }



  // Re-fetch books when the screen is focused
  useFocusEffect(
    useCallback(() => {
      getBooksWithDetails();
      //const initialStates = Object.fromEntries(booksWithDetails.map(b => [b.book.id, b.book.owned === 1]));
      //setOwnedStates(initialStates);
    }, [])
  );

  return (
    loading? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00ffcc" />
        </View>
    ) : (


    // Render the ParallaxScrollView with a header image and book list
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome To Your Digital Library!</ThemedText>
      </ThemedView>

      {/* Subtitle */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='subtitle'>Book List</ThemedText>
      </ThemedView>


      {/* Book List */}
      <ThemedView style={{ padding: 16 }}>
        {/* If no books are found, display a message */}
        {booksWithDetails.length === 0 ? (
          <ThemedText>No books found</ThemedText>
        ) : (
          booksWithDetails.map((b) => (
            // Render each book with its details
            <View key={b.book.id} style={{ marginBottom: 12, backgroundColor: '#202020', padding: 8, borderRadius: 8 }}>
              <ThemedText style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>{b.book.title}</ThemedText>
              <ThemedText style={{ color: 'white' }}>Author: {b.author?.name ?? 'Unknown'}</ThemedText>
              <ThemedText style={{ color: 'white' }}>Series: {b.series?.name ?? 'Unknown'}</ThemedText>


              {/* action buttons for each book */}
              <View
              style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '10%',
                borderRadius: 5, 
                marginVertical:5, 
                padding: 8, 
                backgroundColor: '#202020' }}
              >

                
                {/* Owned Switch */}
                <View key={b.book.id}>
                  <ThemedText style={{ fontSize:12, color: 'white' }}>Owned:</ThemedText>
                  <Switch
                    value={ownedStates[b.book.id] ?? false}
                    onValueChange={
                      async (newValue) => {
                        setLoading(true)
                        try{
                          setOwnedStates(prev => ({ ...prev, [b.book.id]: newValue }));
                          await drizzleDb
                            .update(schema.book)
                            .set({ owned: newValue ? 1 : 0 })
                            .where(eq(schema.book.id, b.book.id));
                        } catch(error) {
                          console.error('Error updating book owned status:', error);
                          alert('Failed to update owned status');
                        } finally {
                          setLoading(false)
                        }
                      }
                    }
                  />
                </View>
                

                {/* Button to update the book */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: '30%' }]}
                  onPress={() => router.push({
                    pathname: '/(tabs)/(books)/updatebook',
                    params: { id: b.book.id }
                  })}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Update
                  </ThemedText>
                </TouchableOpacity>

                {/* Button to delete the book */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: '30%' }]}
                  onPress={() => deleteBook(b.book.id)}>
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


    </ParallaxScrollView>
  ));
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
