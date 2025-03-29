// Theres a error in ios deleting pics
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Dimensions, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const PhotoPreviewSection = ({ photo, handleRetakePhoto, handleSavePhoto }) => {
  const [imageUri, setImageUri] = useState(null);
  const [processedUri, setProcessedUri] = useState(null);
  const isVertical = photo?.orientation === 'vertical';
  
  useEffect(() => {
    // Handle the photo URI to ensure it's in a format that can be displayed
    const processPhotoUri = async () => {
      if (!photo || !photo.uri) return;
      
      try {
        // For iOS photo:// or ph:// URLs that might cause issues
        if (Platform.OS === 'ios' && (photo.uri.startsWith('ph://') || photo.uri.startsWith('file://'))) {
          // Create a local copy of the file to ensure it can be accessed
          const fileName = `${Date.now()}.jpg`;
          const newUri = `${FileSystem.documentDirectory}${fileName}`;
          
          try {
            await FileSystem.copyAsync({
              from: photo.uri,
              to: newUri
            });
            console.log('Successfully copied file to:', newUri);
            setImageUri(newUri);
            setProcessedUri(newUri);
          } catch (error) {
            console.log('Error copying file:', error);
            // Try to use the original URI as fallback
            setImageUri(photo.uri);
            setProcessedUri(null); // Don't set processed URI if copy failed
          }
        } else {
          // For Android or other platforms, use the URI directly
          setImageUri(photo.uri);
          setProcessedUri(null);
        }
      } catch (error) {
        console.log('Error processing image URI:', error);
        setImageUri(photo.uri);
        setProcessedUri(null);
      }
    };
    
    processPhotoUri();
    
    // Cleanup function to delete temporary files when component unmounts
    return () => {
      cleanupTemporaryFile();
    };
  }, [photo]);
  
  // Function to clean up temporary file
  const cleanupTemporaryFile = async () => {
    if (processedUri && processedUri.startsWith(FileSystem.documentDirectory)) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(processedUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(processedUri, { idempotent: true });
          console.log('Deleted temporary file:', processedUri);
        }
      } catch (error) {
        console.log('Error cleaning up temporary file:', error);
      }
    }
  };
  
  // Handle retake by cleaning up processed URI first
  const onRetakePhoto = async () => {
    await cleanupTemporaryFile();
    // After cleanup, call the parent's handleRetakePhoto
    handleRetakePhoto();
  };
  
  // Handle save photo with proper URI
  const onSavePhoto = () => {
    // Use the processed URI if available, otherwise use the original photo URI
    const uriToSave = processedUri || photo.uri;
    handleSavePhoto(uriToSave);
  };
  
  // Don't render until we have a valid URI
  if (!imageUri) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        styles.imageWrapper,
        isVertical ? styles.verticalWrapper : styles.horizontalWrapper
      ]}>
        <Image
          style={styles.image}
          source={{ uri: imageUri }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onRetakePhoto}>
          <AntDesign name="delete" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={onSavePhoto}>
          <AntDesign name="save" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalWrapper: {
    width: width * 0.8,
    height: height * 0.3,
  },
  horizontalWrapper: {
    width: width * 0.6,
    height: height * 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  actionButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});

export default PhotoPreviewSection;