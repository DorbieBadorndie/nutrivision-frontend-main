import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const PhotoPreviewSection = ({ photo, onBack, onSubmit }) => {
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
    <View style={styles.container}>
      {/* Full screen image */}
      <Image
        style={styles.fullScreenImage}
        source={{ uri: imageUri }}
        resizeMode="contain"
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControlsContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.roundButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={onSubmit}>
            <Ionicons name="checkmark" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  roundButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(144, 238, 144, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  }
});

export default PhotoPreviewSection;