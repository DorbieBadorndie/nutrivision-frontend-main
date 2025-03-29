import React, { useRef, useState, useEffect } from 'react';
import { 
  AntDesign, 
  Ionicons 
} from '@expo/vector-icons';
import { 
  Button, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert, 
  Switch, 
  Image, 
  ScrollView,
  Platform 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

import PhotoPreviewSection from '@/components/PhotoPreviewSection';

export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [boxOrientation, setBoxOrientation] = useState('vertical');
  const [isLabelMode, setIsLabelMode] = useState(true); // Default to label mode
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const cameraRef = useRef(null);

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status === 'granted');
    })();
  }, []);

  // Load previously captured photos on mount
  useEffect(() => {
    if (mediaLibraryPermission) {
      loadRecentPhotos();
    }
  }, [mediaLibraryPermission]);

  const loadRecentPhotos = async () => {
    try {
      // Get recent photos from media library
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 10,
        mediaType: 'photo',
        sortBy: ['creationTime']
      });

      // Convert iOS "ph://" URIs to local file URIs
      const recentPhotos = [];
      for (const asset of assets) {
        let uriToUse = asset.uri;
        // On iOS, convert ph:// to local file://
        if (Platform.OS === 'ios' && uriToUse.startsWith('ph://')) {
          try {
            const info = await MediaLibrary.getAssetInfoAsync(asset);
            if (info.localUri) {
              uriToUse = info.localUri;
            }
          } catch (error) {
            console.error('Error getting localUri for asset:', error);
          }
        }
        // Just for mock data: random type/orientation
        recentPhotos.push({
          uri: uriToUse,
          type: Math.random() > 0.5 ? 'label' : 'fruit',
          orientation: Math.random() > 0.5 ? 'vertical' : 'horizontal'
        });
      }

      // Assume the most recent 3 are from our app
      setCapturedPhotos(recentPhotos.slice(0, 3));
    } catch (error) {
      console.error('Error loading recent photos:', error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleBoxOrientation() {
    setBoxOrientation((current) => (current === 'vertical' ? 'horizontal' : 'vertical'));
  }

  function toggleMode() {
    setIsLabelMode((previous) => !previous);
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      
      // Define crop area based on guide box proportions
      const guideBoxWidth = boxOrientation === 'vertical' ? takenPhoto.width * 0.8 : takenPhoto.width * 0.6;
      const guideBoxHeight = boxOrientation === 'vertical' ? takenPhoto.height * 0.3 : takenPhoto.height * 0.5;
      const originX = (takenPhoto.width - guideBoxWidth) / 2;
      const originY = (takenPhoto.height - guideBoxHeight) / 2;
      
      const croppedPhoto = await ImageManipulator.manipulateAsync(
        takenPhoto.uri,
        [
          {
            crop: {
              originX,
              originY,
              width: guideBoxWidth,
              height: guideBoxHeight,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Add orientation and photo type information to the photo object
      croppedPhoto.orientation = boxOrientation;
      croppedPhoto.type = isLabelMode ? 'label' : 'fruit';
      setPhoto(croppedPhoto);
    }
  };

  const handleSavePhoto = async (processedUri) => {
    if (photo && (processedUri || photo.uri)) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your photo library to save photos.'
        );
        return;
      }
      try {
        // Use the processed URI if available, otherwise use the original URI
        const uriToSave = processedUri || photo.uri;
        await MediaLibrary.createAssetAsync(uriToSave);
        
        // Add to capturedPhotos state for thumbnail display
        setCapturedPhotos((prev) => [photo, ...prev.slice(0, 2)]);
        
        Alert.alert('Success', 'Photo saved to your gallery!');
        setPhoto(null); // Go back to camera view
      } catch (error) {
        console.error('Error saving photo to gallery:', error);
        Alert.alert('Error', 'Failed to save photo to gallery.');
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);
  
  const handleDeletePhoto = (index) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (photo) {
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleSavePhoto={handleSavePhoto}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Thumbnails Row */}
      <View style={styles.thumbnailsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {capturedPhotos.map((item, index) => (
            <View key={index} style={styles.thumbnailContainer}>
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(index)}
              >
                <AntDesign name="close" size={16} color="white" />
              </TouchableOpacity>
              <View
                style={[
                  styles.thumbnailIndicator,
                  item.type === 'label' ? styles.labelIndicator : styles.fruitIndicator
                ]}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Switch at bottom to match image */}
      <View style={styles.modeSelectorBottom}>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, isLabelMode ? styles.activeSwitchLabel : {}]}>Labels</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isLabelMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleMode}
            value={!isLabelMode} // Inverted because true = fruit mode
          />
          <Text style={[styles.switchLabel, !isLabelMode ? styles.activeSwitchLabel : {}]}>Fruits</Text>
        </View>
      </View>
      
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Flash button */}
        <TouchableOpacity style={styles.flashButton}>
          <Ionicons name="flash-off" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.overlay}>
          <View
            style={[
              styles.guideBox, 
              boxOrientation === 'horizontal' && styles.horizontalGuideBox,
              isLabelMode ? styles.labelGuideBox : styles.fruitGuideBox
            ]}
          />
        </View>
        
        {/* Camera controls */}
        <View style={styles.cameraControlsContainer}>
          <TouchableOpacity style={styles.rotateButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.orientationButton} onPress={toggleBoxOrientation}>
            <Ionicons name="swap-horizontal" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  thumbnailsRow: {
    height: 80,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginHorizontal: 5,
    position: 'relative',
    overflow: 'hidden',
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelIndicator: {
    backgroundColor: '#f5dd4b',
  },
  fruitIndicator: {
    backgroundColor: '#81b0ff',
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 5,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '80%',
    height: '30%',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  horizontalGuideBox: {
    width: '60%',
    height: '50%',
  },
  labelGuideBox: {
    borderColor: '#f5dd4b', // Yellow for label mode
  },
  fruitGuideBox: {
    borderColor: '#81b0ff', // Blue for fruit mode
  },
  modeSelectorBottom: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  switchLabel: {
    color: '#999',
    marginHorizontal: 10,
    fontWeight: '500',
  },
  activeSwitchLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraControlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  rotateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  orientationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
