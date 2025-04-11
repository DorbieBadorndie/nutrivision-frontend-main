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
    Platform,
    SafeAreaView
  } from 'react-native';
  import { CameraView, useCameraPermissions } from 'expo-camera';
  import * as MediaLibrary from 'expo-media-library';
  import * as ImageManipulator from 'expo-image-manipulator';

  import PhotoPreviewSection from '@/components/PhotoPreviewSection';

  export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [isLabelMode, setIsLabelMode] = useState(true); // Default to label mode
    const [capturedPhotos, setCapturedPhotos] = useState([]);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

    // Always vertical (portrait) orientation. No toggle.
    const boxOrientation = 'vertical';

    // Always use the back camera. No toggle.
    const facing = 'back';

    const cameraRef = useRef(null);

    // Add this function inside the Camera component before the useEffect
    const loadExistingPhotos = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Media library permission not granted');
          return;
        }
    
        const album = await MediaLibrary.getAlbumAsync("NutriVision");
        if (!album) {
          console.log('NutriVision album not found');
          return;
        }
    
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ['photo'],
          first: 5, // Limit to 5 most recent photos
          sortBy: ['creationTime'],
          reverse: true
        });
    
        // Transform assets into the format expected by capturedPhotos
        const photos = await Promise.all(assets.map(async (asset) => {
          // For iOS, get the local filesystem URL instead of ph:// URL
          if (Platform.OS === 'ios') {
            try {
              // Get the local filesystem URL
              const localUri = await MediaLibrary.getAssetInfoAsync(asset.id);
              return {
                uri: localUri.localUri || asset.uri, // Use localUri if available, fallback to asset.uri
                type: 'label',
                id: asset.id
              };
            } catch (error) {
              console.error('Error getting local URI:', error);
              return null;
            }
          }
    
          // For Android, use the asset URI directly
          return {
            uri: asset.uri,
            type: 'label',
            id: asset.id
          };
        }));
    
        // Filter out any null entries and set the photos
        const validPhotos = photos.filter(photo => photo !== null);
        setCapturedPhotos(validPhotos);
    
      } catch (error) {
        console.error('Error loading existing photos:', error);
      }
    };

    // Request media library permissions on mount
    useEffect(() => {
      (async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setMediaLibraryPermission(status === 'granted');
        
        if (status === 'granted') {
          await loadExistingPhotos();
        }
      })();
    }, []);

    // --- Permission checks for camera ---
    if (!permission) {
      return <View />;
    }
    if (!permission.granted) {
      return (
        <View style={[styles.container, styles.centered]}>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      );
    }

    // --- Handlers ---
    function handleGoBack() {
      // Replace with your actual navigation go-back, e.g.:
      // navigation.goBack();
      console.log('Go back pressed');
    }

    function toggleMode() {
      setIsLabelMode((prev) => !prev);
    }

    const handleTakePhoto = async () => {
      if (cameraRef.current) {
        const options = { quality: 1, base64: true, exif: false };
        const takenPhoto = await cameraRef.current.takePictureAsync(options);
    
        if (isLabelMode) {
          // Label mode - crop the image according to guide box
          const cropWidth = takenPhoto.width * 0.7;  // 70% width
          const cropHeight = takenPhoto.height * 0.6; // 60% height
          const originX = (takenPhoto.width - cropWidth) / 2;
          const originY = (takenPhoto.height - cropHeight) / 2;// Adjust for marginBottom
    
          const croppedPhoto = await ImageManipulator.manipulateAsync(
            takenPhoto.uri,
            [
              {
                crop: {
                  originX,
                  originY,
                  width: cropWidth,
                  height: cropHeight,
                },
              },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
          );
    
          croppedPhoto.orientation = 'vertical';
          croppedPhoto.type = 'label';
          setPhoto(croppedPhoto);
        } else {
          // Fruit mode - use the full image
          takenPhoto.type = 'fruit';
          setPhoto(takenPhoto);
        }
      }
    };

    const handleSavePhoto = async (processedUri) => {
      if (!photo) return;
    
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'We need permission to access your photo library to save photos.'
          );
          return;
        }
    
        // Use the processed URI if available, otherwise the original
        const uriToSave = processedUri || photo.uri;
        const asset = await MediaLibrary.createAssetAsync(uriToSave);
    
        // Save to "NutriVision" album
        let album = await MediaLibrary.getAlbumAsync("NutriVision");
        if (!album) {
          album = await MediaLibrary.createAlbumAsync("NutriVision", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    
        // Update local state with asset ID
        const photoWithId = {
          ...photo,
          uri: asset.uri,
          id: asset.id
        };
        
        setCapturedPhotos((prev) => [photoWithId, ...prev].slice(0, 5));
    
        Alert.alert('Success', 'Photo saved to your gallery in NutriVision!');
        setPhoto(null);
      } catch (error) {
        console.error('Error saving photo to gallery:', error);
        Alert.alert('Error', 'Failed to save photo to gallery.');
      }
    };

    const handleDeletePhoto = async (photoToDelete, index) => {
      try {
        // First check for permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'We need permission to delete photos from your gallery.'
          );
          return;
        }
    
        // On iOS, we can directly delete using the asset ID
        if (photoToDelete.id) {
          try {
            const success = await MediaLibrary.deleteAssetsAsync([photoToDelete.id]);
            if (success) {
              // Remove from thumbnails after successful gallery deletion
              setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
              console.log('Photo deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete photo from gallery');
            }
          } catch (deleteError) {
            console.error('Error deleting asset:', deleteError);
            Alert.alert('Error', 'Failed to delete photo');
          }
          return;
        }
    
        // Fallback method if no ID is available
        const album = await MediaLibrary.getAlbumAsync("NutriVision");
        if (!album) {
          console.log('NutriVision album not found');
          return;
        }
    
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ['photo'],
          first: 50,
          sortBy: ['creationTime'],
          reverse: true // Get most recent first
        });
    
        if (assets.length === 0) {
          console.log('No assets found in album');
          return;
        }
    
        // Find matching asset by comparing URIs
        const assetToDelete = assets.find(asset => 
          asset.uri.replace('ph://', '') === photoToDelete.uri.replace('ph://', '')
        );
    
        if (assetToDelete) {
          const success = await MediaLibrary.deleteAssetsAsync([assetToDelete]);
          if (success) {
            setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
            console.log('Photo deleted successfully');
          } else {
            Alert.alert('Error', 'Failed to delete photo from gallery');
          }
        } else {
          Alert.alert('Error', 'Could not find photo in gallery');
        }
    
      } catch (error) {
        console.error('Error in handleDeletePhoto:', error);
        Alert.alert(
          'Error',
          'Failed to delete photo. Please try again.'
        );
      }
    };

    // --- If we have a photo, show preview with "Back" + "Submit" buttons. ---
    if (photo) {
      return (
        <View style={styles.container}>
          <PhotoPreviewSection
            photo={photo}
          />
          
          {/* Bottom Controls: Left = Back, Right = Submit */}
          <View style={styles.bottomControlsContainer}>
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.roundButton} onPress={() => setPhoto(null)}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.captureButton} onPress={() => handleSavePhoto()}>
                <Ionicons name="checkmark" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // --- Otherwise, show the Camera view ---
    return (
      <View style={styles.container}>
        {/* Thumbnails Row: Only photos captured by this module, limited to 5 */}
        <SafeAreaView style={styles.thumbnailsContainer}>
          <View style={styles.thumbnailsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {capturedPhotos.map((item, index) => (
                <View key={index} style={styles.thumbnailContainer}>
                  <Image 
                    source={{ 
                      uri: Platform.OS === 'ios' ? 
                        item.uri.replace('ph://', 'file://') : 
                        item.uri 
                    }} 
                    style={styles.thumbnail}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePhoto(item, index)}
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
            </ScrollView>
          </View>
        </SafeAreaView>

        {/* Mode Selector at the bottom (Labels / Fruits) */}
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
          {/* Overlay + guide box (only in label mode) */}
          <View style={styles.overlay}>
            {isLabelMode && (
              <View style={[styles.guideBox, styles.labelGuideBox]} />
            )}
          </View>

          {/* Bottom Controls: Left = Back, Center = Capture, Right = Submit (disabled if no photo) */}
          <View style={styles.bottomControlsContainer}>
            <View style={styles.bottomControls}>
              {/* LEFT: Go Back */}
              <TouchableOpacity style={styles.roundButton} onPress={handleGoBack}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>

              {/* CENTER: Capture */}
              <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              {/* RIGHT: Submit Photo (disabled because no photo yet) */}
              <TouchableOpacity style={[styles.roundButton, { opacity: 0.5 }]} disabled={true}>
                <Ionicons name="checkmark" size={28} color="white" />
              </TouchableOpacity>
            </View>
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
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
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
      backgroundColor: 'transparent',
    },
    labelGuideBox: {
      borderColor: '#f5dd4b', // Yellow
      width: '70%',
      height: '60%'
    },
    fruitGuideBox: {
      borderColor: '#81b0ff', // Blue
    },

    // Bottom "Labels/Fruits" switch
    modeSelectorBottom: {
      position: 'absolute',
      top: 160, // Increase this value to move it higher up
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
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
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

    // Bottom controls - updated to match UI in mockup
    bottomControls: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    
    // New rounded button style to match the image
    roundButton: {
      width: 55,
      height: 55,
      borderRadius: 30,
      backgroundColor: 'rgba(144, 238, 144, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },

    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(144, 238, 144, 0.8)',
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
      borderColor: 'rgba(144, 238, 144, 1)',
    },
    bottomControlsContainer: {
      position: 'absolute', // Changed from 'bottom' to 'absolute'
      bottom: 0, // Changed from 10 to 0 to extend to the very bottom
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
    }
  });