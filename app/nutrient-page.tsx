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
import { useFonts } from 'expo-font';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';
import PieChart from 'react-native-pie-chart';

const { width, height } = Dimensions.get('window');

// Helper Function
const toPercentageText = (value: number): string => `${value}%`;
const formatValue = (value: number, unit: string = 'g'): string => `${value} ${unit}`;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

export default function UserNutrientPage() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [capturedPhotos, setCapturedPhotos] = useState<{ uri: string; type: string; orientation: string }[]>([]);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);

  // Navigation
  const navigation = useNavigation() as HomeScreenNavigationProp;

  // State for nutrient inputs (now as numbers without units)
  const [nutrients, setNutrients] = useState({
    sugar: 15,
    sodium: 250,
    calories: 200
  });

  const [isEditing, setIsEditing] = useState({
    sugar: false,
    sodium: false,
    calories: false
  });

  interface NutritionData {
    userIntake: {
      breakdown: { calories: number; sugar: number; sodium: number };
      total: number;
    };
  }

  const [nutritionData, setNutritionData] = useState<NutritionData>({
      userIntake: { 
        breakdown: { calories: 22, sugar: 45, sodium: 22 },
        total: 209
      }
    });

    const textUserIntakeCalories = toPercentageText(nutritionData.userIntake.breakdown.calories);
    const textUserIntakeSugar = toPercentageText(nutritionData.userIntake.breakdown.sugar);
    const textUserIntake = toPercentageText(nutritionData.userIntake.breakdown.sodium);

    const totalUserIntake = formatValue(nutritionData.userIntake.total);

    const donutSeries = [
      { value: nutritionData.userIntake.breakdown.sodium, color: '#000000' },
      { value: nutritionData.userIntake.breakdown.sugar, color: '#c0b4b4' },
      { value: nutritionData.userIntake.breakdown.calories, color: '#7ca844' },
    ];

  // Toggle edit mode
  const toggleEdit = (key: 'sugar' | 'sodium' | 'calories') => {
    setIsEditing(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle nutrient change
  const handleNutrientChange = (key: 'sugar' | 'sodium' | 'calories', value: string) => {
    const numValue = parseInt(value) || 0;
    setNutrients(prev => ({ ...prev, [key]: numValue }));
  };

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
    navigation.navigate('page-6');
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

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
              
              <View style={styles.userIntakeCard}>
                <Text style={styles.userText}>User </Text>
                <Text style={styles.intakeText}>Intake</Text>
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

              {/* Input section */}
              <View style={styles.inputSection}>
                {/* Sugar Input */}
                <View style={styles.inputRow}>
                  <Image source={require('@/assets/images/Sugar Icon.png')} style={styles.icon} />
                  <Text style={styles.nutrientText}>Sugar</Text>
                  <View style={styles.divider} />
                  <View style={styles.inputBox}>
                    {isEditing.sugar ? (
                      <TextInput
                        style={styles.input}
                        value={nutrients.sugar.toString()}
                        onChangeText={(text) => handleNutrientChange('sugar', text)}
                        autoFocus
                        onBlur={() => toggleEdit('sugar')}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    ) : (
                      <>
                        <Text style={styles.inputText}>{nutrients.sugar}</Text>
                        <TouchableOpacity 
                          style={styles.editButtonInside}
                          onPress={() => toggleEdit('sugar')}
                        >
                          <Image source={require('@/assets/images/Edit Icon.png')} style={styles.editIcon} />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                {/* Sodium Input */}
                <View style={styles.inputRow}>
                  <Image source={require('@/assets/images/Sodium Icon.png')} style={styles.icon} />
                  <Text style={styles.nutrientText}>Sodium</Text>
                  <View style={styles.divider} />
                  <View style={styles.inputBox}>
                    {isEditing.sodium ? (
                      <TextInput
                        style={styles.input}
                        value={nutrients.sodium.toString()}
                        onChangeText={(text) => handleNutrientChange('sodium', text)}
                        autoFocus
                        onBlur={() => toggleEdit('sodium')}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    ) : (
                      <>
                        <Text style={styles.inputText}>{nutrients.sodium}</Text>
                        <TouchableOpacity 
                          style={styles.editButtonInside}
                          onPress={() => toggleEdit('sodium')}
                        >
                          <Image source={require('@/assets/images/Edit Icon.png')} style={styles.editIcon} />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                {/* Calories Input */}
                <View style={styles.inputRow}>
                  <Image source={require('@/assets/images/Cholesterol Icon.png')} style={styles.icon} />
                  <Text style={styles.nutrientText}>Calories</Text>
                  <View style={styles.divider} />
                  <View style={styles.inputBox}>
                    {isEditing.calories ? (
                      <TextInput
                        style={styles.input}
                        value={nutrients.calories.toString()}
                        onChangeText={(text) => handleNutrientChange('calories', text)}
                        autoFocus
                        onBlur={() => toggleEdit('calories')}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    ) : (
                      <>
                        <Text style={styles.inputText}>{nutrients.calories}</Text>
                        <TouchableOpacity 
                          style={styles.editButtonInside}
                          onPress={() => toggleEdit('calories')}
                        >
                          <Image source={require('@/assets/images/Edit Icon.png')} style={styles.editIcon} />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>

              {/* Donut Chart Boxes */}
              <View key='User Intake' style={styles.newBox}>
                <View style={styles.innerRow}>
                  <View style={styles.newLeftColumn}>
                    <PieChart
                      widthAndHeight={170}
                      series={donutSeries}
                      cover={0.55}
                    />
                  </View>
                  <View style={styles.newRightColumn}>
                    <Text style={styles.newLegendTitle}>{'User Intake'}</Text>
                    <View style={styles.newLegendItem}>
                      <View style={[styles.newCircle, { backgroundColor: '#7ca844' }]} />
                      <Text style={styles.newLegendText}>Calories ({textUserIntakeCalories})</Text>
                    </View>
                    <View style={styles.newLegendItem}>
                      <View style={[styles.newCircle, { backgroundColor: '#c0b4b4' }]} />
                      <Text style={styles.newLegendText}>Sugar ({textUserIntakeSugar})</Text>
                    </View>
                    <View style={styles.newLegendItem}>
                      <View style={[styles.newCircle, { backgroundColor: '#000000' }]} />
                      <Text style={styles.newLegendText}>Sodium ({textUserIntake})</Text>
                    </View>
                    <View style={styles.newTotalBox}>
                      <Text style={styles.newTotalText}>
                        Total Nutrient{'\n'}Amount = {totalUserIntake}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
          
      {/* Floating check button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <ThemedText style={styles.checkMark}>✓</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
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
  newBox: {
    marginTop: 20,
    marginHorizontal: 10,
    width: screenWidth - 32,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  innerRow: {
    flexDirection: 'row',
  },
  newLeftColumn: {
    flex: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRightColumn: {
    flex: 40,
    paddingLeft: 10,
    justifyContent: 'center',
    gap: 6,
  },
  newLegendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: -20
  },
  newLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  newLegendText: {
    fontSize: 14,
    color: '#333',
  },
  newTotalBox: {
    backgroundColor: '#f8e4e4',
    marginTop: 10,
    padding: 10,
    borderRadius: 15,
    alignItems: 'flex-start',
    marginLeft: -20,
  },
  newTotalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left'
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