import { StyleSheet } from 'react-native';

export const myStyles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5', // Indigo-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // for Android
    width: '80%', // Adjust width as needed
    maxWidth: 400, // Optional: limit max width for larger screens
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  smallButton: {
    backgroundColor: '#4F46E5', // Indigo-600
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android
    width: '15%', // Adjust width as needed
    maxWidth: 80, // Optional: limit max width for larger screens
    marginHorizontal: 2,
    //marginLeft: 'auto', // Align to the right
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
