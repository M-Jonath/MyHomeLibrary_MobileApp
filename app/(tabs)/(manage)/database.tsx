import { View, Button, Alert, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

const DB_FILE_NAME = 'SQLite/mylibrary.db';

export default function DatabaseScreen() {
  const dbPath = `${FileSystem.documentDirectory}${DB_FILE_NAME}`;

  // Reset DB: delete then re-initialize schema
  const resetDatabase = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
      }

      // Open a new connection (expo-sqlite creates it if not exists)
      const sqliteDb = useSQLiteContext();
      const drizzleDb = drizzle(sqliteDb, { schema });

      // Optionally run a dummy select to trigger table creation
      // or call your schema sync method if you have one
      await drizzleDb.select().from(schema.genre).all();

      Alert.alert('Success', 'Database has been reset');
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert('Error', 'Failed to reset database');
    }
  };

  const exportDatabase = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (!fileInfo.exists) {
        Alert.alert('Export Failed', 'Database file not found');
        return;
      }

      await Sharing.shareAsync(dbPath);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export database');
    }
  };

  const importDatabase = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/octet-stream',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: dbPath,
        });
        Alert.alert('Success', 'Database imported. Restart app to load new data.');
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import database');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{dbPath}</Text>

      <Button title="Export Database" onPress={exportDatabase} />
      <View style={{ height: 20 }} />

      <Button title="Import Database" onPress={importDatabase} />
      <View style={{ height: 20 }} />

      <Button title="Reset Database" onPress={resetDatabase} />
    </View>
  );
}
