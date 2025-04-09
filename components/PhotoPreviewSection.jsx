import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, View, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const PhotoPreviewSection = ({ photo }) => {
  const [imageUri, setImageUri] = useState(null);
  const [processedUri, setProcessedUri] = useState(null); 

  useEffect(() => {
    const processPhotoUri = async () => {
      if (!photo || !photo.uri) return;

      try {
        if (Platform.OS === 'ios' && (photo.uri.startsWith('ph://') || photo.uri.startsWith('file://'))) {
          const fileName = `${Date.now()}.jpg`;
          const newUri = `${FileSystem.documentDirectory}${fileName}`;
          try {
            await FileSystem.copyAsync({
              from: photo.uri,
              to: newUri,
            });
            setImageUri(newUri);
            setProcessedUri(newUri);
          } catch (error) {
            console.log('Error copying file:', error);
            setImageUri(photo.uri);
            setProcessedUri(null);
          }
        } else {
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
    return () => cleanupTemporaryFile();
  }, [photo]);

  const cleanupTemporaryFile = async () => {
    if (processedUri && processedUri.startsWith(FileSystem.documentDirectory)) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(processedUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(processedUri, { idempotent: true });
        }
      } catch (error) {
        console.log('Error cleaning up temporary file:', error);
      }
    }
  };

  if (!imageUri) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        photo.type === 'label' ? styles.labelWrapper : styles.fruitWrapper
      ]}>
        <Image
          style={styles.image}
          source={{ uri: imageUri }}
          resizeMode={photo.type === 'label' ? "contain" : "cover"}
          resizeMethod="resize"
        />
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
  labelWrapper: {
    borderColor: '#f5dd4b',
    borderWidth: 3,
    width: '70%',
    height: '60%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: '-50%'
  },
  fruitWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default PhotoPreviewSection;