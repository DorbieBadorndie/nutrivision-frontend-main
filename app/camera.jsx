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
    SafeAreaView,
    Dimensions
  } from 'react-native';
  import { CameraView, useCameraPermissions } from 'expo-camera';
  import * as MediaLibrary from 'expo-media-library';
  import * as ImageManipulator from 'expo-image-manipulator';

  import PhotoPreviewSection from '@/components/PhotoPreviewSection';

  const { height } = Dimensions.get('window');

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
    
        console.log('Found assets:', assets.length); // Debug log
    
        const photos = await Promise.all(assets.map(async (asset) => {
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            const uri = Platform.OS === 'ios'
              ? `file://${assetInfo.localUri?.replace('ph://', '') || assetInfo.uri.replace('ph://', '')}`
              : asset.uri;
    
            return {
              uri,
              type: 'label', // or determine type from metadata if available
              id: asset.id
            };
          } catch (error) {
            console.error('Error processing asset:', error);
            return null;
          }
        }));
    
        const validPhotos = photos.filter(photo => photo !== null);
        console.log('Valid photos:', validPhotos.length); // Debug log
    
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

    useEffect(() => {
      if (mediaLibraryPermission) {
        loadExistingPhotos();
      }
    }, [mediaLibraryPermission]);

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
          Alert.alert('Permission required', 'We need permission to access your photo library to save photos.');
          return;
        }
    
        // Use the processed URI if available, otherwise the original
        const uriToSave = processedUri || photo.uri;
        const asset = await MediaLibrary.createAssetAsync(uriToSave);
    
        // For iOS, get the proper local URI
        let localUri = asset.uri;
        if (Platform.OS === 'ios') {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
          localUri = assetInfo.localUri || assetInfo.uri;
        }
    
        // Save to "NutriVision" album
        let album = await MediaLibrary.getAlbumAsync("NutriVision");
        if (!album) {
          album = await MediaLibrary.createAlbumAsync("NutriVision", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    
        // Create the photoWithId object with the proper URI format
        const photoWithId = {
          ...photo,
          uri: Platform.OS === 'ios' ? `file://${localUri.replace('ph://', '')}` : localUri,
          id: asset.id,
          type: photo.type || 'label'
        };
    
        // Update local state
        setCapturedPhotos(prev => {
          const newPhotos = [photoWithId, ...prev].slice(0, 5);
          console.log('Updated photos:', newPhotos); // Debug log
          return newPhotos;
        });
    
        // Reload photos from gallery to ensure consistency
        await loadExistingPhotos();
    
        Alert.alert('Success', 'Photo saved to your gallery in NutriVision!');
        setPhoto(null);
    
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo to gallery.');
      }
    };

    const handleDeletePhoto = async (photoToDelete, index) => {
      try {
        console.log('Attempting to delete photo:', {
          id: photoToDelete.id,
          uri: photoToDelete.uri,
          index
        });
    
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'We need permission to delete photos from your gallery.');
          return;
        }
    
        // Get the album first
        const album = await MediaLibrary.getAlbumAsync("NutriVision");
        if (!album) {
          console.log('NutriVision album not found');
          return;
        }
    
        // Get all assets from the album
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ['photo']
        });
    
        console.log('Found assets in album:', assets.length);
    
        // Clean up URIs for comparison
        const cleanUri = (uri) => {
          if (!uri) return '';
          return uri
            .replace('ph://', '')
            .replace('file://', '')
            .split('?')[0]
            .split('#')[0];
        };
    
        // Try to find the asset to delete
        let assetToDelete;
        
        if (photoToDelete.id) {
          // First try by ID
          assetToDelete = assets.find(asset => asset.id === photoToDelete.id);
        }
    
        if (!assetToDelete) {
          // If not found by ID, try by URI
          const targetUri = cleanUri(photoToDelete.uri);
          console.log('Looking for URI match:', targetUri);
          
          assetToDelete = assets.find(asset => {
            const assetUri = cleanUri(asset.uri);
            const matches = assetUri === targetUri;
            if (matches) {
              console.log('Found matching asset:', asset.id);
            }
            return matches;
          });
        }
    
        if (assetToDelete) {
          const success = await MediaLibrary.deleteAssetsAsync([assetToDelete.id]);
          if (success) {
            // Remove from local state only after successful deletion
            setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
            console.log('Photo deleted successfully');
            
            // Reload the gallery to ensure consistency
            await loadExistingPhotos();
          } else {
            throw new Error('Failed to delete asset');
          }
        } else {
          console.log('Asset not found in album');
          // Remove from local state even if asset not found
          setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
        }
    
      } catch (error) {
        console.error('Delete photo error:', error);
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
            onBack={() => setPhoto(null)}
            onSubmit={() => handleSavePhoto()}
          />
        </View>
      );
    }

    // Update the return statement layout
    return (
      <View style={styles.container}>
        {/* Top section for thumbnails */}
        <View style={styles.topSection}>
          <SafeAreaView>
            <View style={styles.thumbnailsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {capturedPhotos.map((item, index) => (
                  <View key={index} style={styles.thumbnailContainer}>
                    <Image 
                      source={{ 
                        uri: Platform.OS === 'ios' 
                          ? `file://${item.uri.replace('ph://', '').replace('file://', '')}`
                          : item.uri 
                      }} 
                      style={styles.thumbnail}
                      resizeMode="cover"
                      onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        console.log('Delete button pressed for index:', index);
                        handleDeletePhoto(item, index);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
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
        </View>

        {/* Main camera section with flex */}
        <View style={styles.mainSection}>
          {/* Mode Selector */}
          <View style={styles.modeSelectorWrapper}>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, isLabelMode ? styles.activeSwitchLabel : {}]}>
                Labels
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isLabelMode ? 'lightgreen' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleMode}
                value={!isLabelMode}
              />
              <Text style={[styles.switchLabel, !isLabelMode ? styles.activeSwitchLabel : {}]}>
                Fruits
              </Text>
            </View>
          </View>

          {/* Camera View */}
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
      overflow: 'visible', // Changed from 'hidden' to show delete button
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
      top: 2,
      right: 2,
      backgroundColor: 'rgba(0,0,0,0.6)',
      width: 24, // Increased from 20
      height: 24, // Increased from 20
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2, // Ensure it's above the image
      elevation: 4, // For Android
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
      borderColor: 'lightgreen', // Yellow
      width: '70%',
      height: '60%'
    },
    fruitGuideBox: {
      borderColor: '#81b0ff', // Blue
    },

    // Bottom "Labels/Fruits" switch
    modeSelectorWrapper: {
      position: 'absolute',
      top: 20,
      left: 0,
      right: 0,
      zIndex: 10,
      alignItems: 'center',
    },
    modeSelectorBottom: {
      alignItems: 'center',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 25,
      maxWidth: 250,
      marginHorizontal: 'auto',
    },
    switchLabel: {
      color: '#999',
      marginHorizontal: 8,
      fontSize: 14,
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
    },
    cameraWrapper: {
      flex: 1,
      position: 'relative',
    },
    thumbnailsContainer: {
      backgroundColor: '#FFFFFF',
      zIndex: 10,
    },
    topSection: {
      backgroundColor: '#FFFFFF',
      zIndex: 10,
    },
    mainSection: {
      flex: 1,
      position: 'relative',
    },
  });