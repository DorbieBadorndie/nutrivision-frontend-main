import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

export default function UserNutrientPage() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [capturedPhotos, setCapturedPhotos] = useState<{ uri: string; type: string; orientation: string }[]>([]);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);

  // ======== NAVIGATION ========
  const navigation = useNavigation() as HomeScreenNavigationProp;

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

        // Filter out any invalid URIs
        setCapturedPhotos(recentPhotos.slice(0, 5).filter(photo => 
          photo.uri && typeof photo.uri === 'string'
        ));

        // Assume the most recent 5 are from our app
        setCapturedPhotos(recentPhotos.slice(0, 5));
      } catch (error) {
        console.error('Error loading recent photos:', error);
      }
    };

    const handleCheck = () => {
      navigation.navigate('camera'); // ✅ Ensure 'Camera' exists in stack
    };
  
    if (!fontsLoaded) {
      return <Text>Loading...</Text>; // ✅ Fallback while loading fonts
    }

    // USER INTAKE SECTION
  return (
    <View style={styles.container}>
  <View style={styles.header}>  {/* NEW: Wrapped logo & card in a header View */}
    <Image source={require('@/assets/images/NutriVision.png')} style={styles.logo} />
    <View style={styles.userIntakeCard}>
      <Text style={styles.userText}>User </Text>
      <Text style={styles.intakeText}>Intake</Text>
    </View>
  </View>
  <View style={styles.content}>
    <View style={styles.thumbnailWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsRow}>
        {capturedPhotos.map((item, index) => (
          <View key={index} style={styles.thumbnailContainer}>
            <View style={styles.thumbnail}>
            {item.uri ? (
              <Image 
                source={{ uri: item.uri }} 
                style={styles.thumbnail}
                onError={() => console.log("Image failed to load")}/>
              ) : (
              <Text style={{ color: 'gray', fontSize: 10 }}>No Image</Text>
              )}
            </View>
              <View style={[
                styles.thumbnailIndicator,
                item.type === 'label' ? styles.labelIndicator : styles.fruitIndicator
              ]}/>
      </View>
))}
      </ScrollView>
    </View>
  </View>
      {/* Floating check button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <ThemedText style={styles.checkMark}>✓</ThemedText>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
    backgroundColor: '#F5F5F5',
  },
  header: {  // NEW: Proper header container
    paddingTop: 50,
    paddingLeft: 1,
    marginBottom: 20,
  },
  logo: {
    top: -5 * (height * 0.01),
    left: width * 0.02,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  userIntakeCard: {
    backgroundColor: 'white',
    marginTop: -40,  // NEW: Slight overlap with logo (optional)
    marginLeft: 10,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
  },
  userText: {
    color: '#9AB206',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  intakeText: {
    color: '#4D4444',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  checkButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 25,
    color: '#9AB206', // ✅ Ensured consistent color
    fontWeight: 'bold',
  },
  content: {  // NEW: Dedicated space for thumbnails
    flex: 1,
    paddingHorizontal: 20,
  },
  thumbnailWrapper: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
});
