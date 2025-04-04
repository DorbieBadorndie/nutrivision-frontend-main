import React, { useEffect, useState } from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  ScrollView, 
  SafeAreaView, 
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/types';
import * as MediaLibrary from 'expo-media-library';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;


function Feedback() {
    const navigation = useNavigation() as HomeScreenNavigationProp;
      const [capturedPhotos, setCapturedPhotos] = useState<{ uri: string; type: string; orientation: string }[]>([]);
      const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
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
          const { assets } = await MediaLibrary.getAssetsAsync({
            first: 5,
            mediaType: 'photo',
            sortBy: ['creationTime']
          });
    
          const recentPhotos = [];
          for (const asset of assets) {
            let uriToUse = asset.uri;
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
            
            recentPhotos.push({
              uri: uriToUse,
              type: Math.random() > 0.5 ? 'label' : 'fruit',
              orientation: Math.random() > 0.5 ? 'vertical' : 'horizontal'
            });
          }
    
          setCapturedPhotos(recentPhotos.slice(0, 5).filter(photo => 
            photo.uri && typeof photo.uri === 'string'
          ));
        } catch (error) {
          console.error('Error loading recent photos:', error);
        }
      };
    

    const handleCheck = () => {
        navigation.navigate('Index');
      };
      
    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0} // Adjust as needed
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image 
                                source={require('@/assets/images/NutriVision.png')} 
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                        {/* Thumbnail section */}
                        <View style={styles.thumbnailSection}>
                            <View style={styles.thumbnailWrapper}>
                                <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                contentContainerStyle={styles.thumbnailsRow}
                                >
                                {capturedPhotos.map((item, index) => (
                                    <View key={index} style={styles.thumbnailContainer}>
                                    {item.uri ? (
                                        <Image 
                                        source={{ uri: item.uri }} 
                                        style={styles.thumbnail}
                                        onError={() => console.log("Image failed to load")}
                                        />
                                    ) : (
                                        <View style={styles.thumbnail}>
                                        <Text style={styles.placeholderText}>No Image</Text>
                                        </View>
                                    )}
                                    </View>
                                ))}
                                </ScrollView>
                            </View>
                        </View>
                          
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
                <ThemedText style={styles.checkMark}>
                    <Image 
                        source={require('@/assets/images/Home.png')} 
                        style={{ width: 30, height: 30 }} // Adjust the size as needed
                    />
                </ThemedText>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    safeContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100, // Add space for floating button
    },
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 20,
    },
    header: {
      marginLeft: -15,
      width: '100%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    logo: {
      width: 200,
      height: 150,
    },
    userIntakeCard: {
      marginTop: -15,
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      marginBottom: 20,
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
    thumbnailSection: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      marginBottom: 20,
    },
    thumbnailWrapper: {
      width: '100%',
    },
    thumbnailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
    },
    thumbnailContainer: {
      width: 60,
      height: 60,
      marginHorizontal: 5,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#DDDDDD',
      overflow: 'hidden',
    },
    thumbnail: {
      width: '100%',
      height: '100%',
    },
    placeholderText: {
      color: 'gray',
      fontSize: 10,
      textAlign: 'center',
      marginTop: 20
    },
    inputSection: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 7.5,
      marginHorizontal: 8,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    nutrientText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#4D4444',
    },
    editIcon: {
      width: 13,
      height: 13,
    },
    editButtonInside: {
      position: 'absolute',
      right: 5,
      top: '50%',
      transform: [{ translateY: -8 }], // Center vertically (half of icon height)
    },
    inputBox: {
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
      width: 80,
      height: 40,
      justifyContent: 'center',
      position: 'relative', // Added to position the edit icon inside
    },
    inputText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      height: '100%',
      fontSize: 14,
      color: '#333',
      padding: 0,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: '#DDDDDD',
      flex: 1, // Makes it take up available space
      marginHorizontal: 10,
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
      color: '#9AB206',
      fontWeight: 'bold',
    },
  });

export default Feedback;
