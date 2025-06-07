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
import CustomScrollView from '@/components/CustomScrollView';



export default function ManageSeries() {
  // Initialize the SQLite database and Drizzle ORM
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [loading, setLoading] = useState(false);

  // Router for navigation
  const router = useRouter();

  // State to hold the list of series
  const [series, setSeries] = useState<schema.Series[]>([]);

  // Function to fetch series from the database
  const getSeries = async () => {
    setLoading(true);
    try {
      const fetchedSeries = await drizzleDb.select().from(schema.series);
      setSeries(fetchedSeries);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
    // Fetch authors when the component is focused
    useFocusEffect(
      useCallback(() => {
        getSeries();
      }, [])
    );



  return (
    loading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    ) : (
    //<SafeAreaView>
      //<ScrollView style={{ paddingHorizontal: 16 }}>
      <CustomScrollView>
        <View style={{ height: 80 }} />

        {/* Title Section */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            style={{ fontSize: 24, color: 'white' }}
            type="title">
              Manage Series
          </ThemedText>
        </ThemedView>
        

        {/* Button to add a new series */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          <TouchableOpacity
            style={myStyles.button}
            onPressIn={() => {
                router.push('/(tabs)/(manage)/(add)/addseries');

            }}
          >
            <ThemedText 
              style={[myStyles.buttonText]}
              type="defaultSemiBold">
              Add New Series
            </ThemedText>
          </TouchableOpacity>
        </View>
        

        {/* Displaying the list of series */}
        <ThemedView style={{ padding: 16, backgroundColor: 'black', borderRadius: 8 }}>
          {series.length === 0 ? (
          <ThemedText
          style={{ flexDirection: 'row', borderRadius: 5, marginVertical:5, padding: 8, backgroundColor: '#151515', color:'white' }}
          >No Series found</ThemedText>
          ) : (
          series.map((series) => (
            <View key={series.id} style={{ flexDirection: 'row', borderRadius: 5, marginVertical:5, padding: 8, backgroundColor: '#202020' }}>
              
              {/* Displaying series name */}
              <ThemedText
              style={ { fontSize: 16, color: 'white', flex: 1} }>
                {series.name}
              </ThemedText>

              {/* action buttons for each series */}
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>

                {/* Button to update the series */}
                <TouchableOpacity
                  style={[myStyles.smallButton, { width: 50 }]}
                  onPressIn={() => router.push({
                    pathname: '/(tabs)/(manage)/update',
                    params: { type: 'series', id: series.id }
                  })}>
                  <ThemedText 
                    style={myStyles.smallButtonText}
                    type="defaultSemiBold">
                    Update
                  </ThemedText>
                </TouchableOpacity>

                {/* Button to delete the series */}
                <TouchableOpacity
                style={[myStyles.smallButton, { width: 50 }]}
                onPressIn={async () => {
                  setLoading(true);
                  try {
                    await drizzleDb.delete(schema.series).where(eq(schema.series.id, series.id));
                    await getSeries(); 
                  } catch (error) {
                    console.error('Error deleting series:', error);
                    alert('Failed to delete series');
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
