import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Carousel from 'react-native-reanimated-carousel';
import { RootStackParamList } from '@/types/types'; // adjust path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

export default function HomeScreen() {
  // ======== AGE STATE ========
  const [age, setAge] = useState<number>(25);
  const [inputValue, setInputValue] = useState<string>('25');
  const [inputError, setInputError] = useState(false);

  const handleAgeChange = (text: string) => {
    setInputValue(text);
    if (/^\d+$/.test(text)) {
      const newAge = parseInt(text, 10);
      if (!isNaN(newAge)) {
        setAge(Math.max(18, newAge));
        setInputError(false);
        return;
      }
    }
    setInputError(true);
  };

  const handleIncrement = () => {
    setAge(prev => {
      const newAge = prev + 1;
      setInputValue(newAge.toString());
      return newAge;
    });
  };

  const handleDecrement = () => {
    setAge(prev => {
      const newAge = Math.max(18, prev - 1);
      setInputValue(newAge.toString());
      return newAge;
    });
  };

  // ======== WEIGHT STATE ========
  const [weightValue, setWeightValue] = useState<string>('54.2');
  const [isKg, setIsKg] = useState(true); // true => kg, false => lb
  const toggleWeightUnit = () => setIsKg(prev => !prev);

  // ======== HEIGHT STATE ========
  const [heightValue, setHeightValue] = useState<string>("5'7");
  const [isFt, setIsFt] = useState(true); // true => ft, false => cm
  const toggleHeightUnit = () => setIsFt(prev => !prev);

  // ======== NAVIGATION ========
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // ======== CAROUSEL DATA ========
  const carouselItems = [
    {
      id: 'slide-1',
      title: '',
      text: `DISCLAIMER: Any information provided is for educational purposes only and should not be considered medical or professional advice. Always consult a qualified professional for health-related decisions.`,
    },
    {
      id: 'slide-2',
      title: '',
      text: `To optimize your experience and provide personalized recommendations, we collect your age, weight, and height. This helps us tailor our services to better suit your needs and preferences.`,
    },
    {
      id: 'slide-3',
      title: '',
      text: `Measurements may not always be 100% accurate, and slight variations can occur based on different factors. We recommend using precise measuring tools and consulting experts for the most reliable data.`,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const renderDetailBox = ({ item }: { item: typeof carouselItems[0] }) => {
    return (
      <View style={styles.carouselDetailBox}>
        <ThemedText style={styles.carouselText}>{item.text}</ThemedText>
      </View>
    );
  };

  // When the check button is pressed, navigate to 'Page-6'
  const handleCheck = () => {
    navigation.navigate('5.1 User Nutrient Page');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0} // Adjust as needed
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ThemedView style={[styles.container, { backgroundColor: '#eff1f6' }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
              {/* Background/Top Image */}
              <Image
                source={require('@/assets/images/NutriVision.png')}
                style={styles.image}
                accessibilityRole="image"
                accessibilityLabel="NutriVision logo"
              />

              {/* ===== NEW PROFILE BOX ===== */}
              <View style={styles.profileBox}>
                <ThemedText style={styles.profileBoxText}>
                  User <ThemedText style={styles.profileText}>Profile</ThemedText> Details
                </ThemedText>
              </View>

              {/* ========== CAROUSEL (ANIMATED DETAIL BOXES) ========== */}
              <View style={styles.carouselContainer}>
                <Carousel
                  data={carouselItems}
                  renderItem={renderDetailBox}
                  width={SCREEN_WIDTH - 20}
                  height={160}
                  style={{ alignSelf: 'center' }}
                  onSnapToItem={index => setActiveIndex(index)}
                />

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                  {carouselItems.map((_, i) => (
                    <View
                      key={i}
                      style={[styles.dot, { backgroundColor: i === activeIndex ? '#385802' : '#ccc' }]}
                    />
                  ))}
                </View>
              </View>

              {/* =============== AGE CONTAINER =============== */}
              <View style={styles.ageContainer}>
                <View style={styles.leftColumn}>
                  <View style={styles.topLeft}>
                    <ThemedText style={styles.ageTitle}>Age</ThemedText>
                  </View>
                  <View style={styles.bottomLeft}>
                    <ThemedText style={styles.ageSubtitle}>
                      Age affects nutrient intake by changing metabolism, absorption, and dietary needs.
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.formContainer}>
                    <View style={styles.counterWrapper}>
                      <TouchableOpacity style={styles.counterButton} onPress={handleDecrement}>
                        <ThemedText style={styles.counterText}>{'<'}</ThemedText>
                      </TouchableOpacity>

                      <TextInput
                        style={[styles.ageInput, inputError && styles.inputError]}
                        keyboardType="numeric"
                        returnKeyType="done"
                        value={inputValue}
                        onChangeText={handleAgeChange}
                        maxLength={3}
                        onBlur={() => {
                          if (inputError || age.toString() !== inputValue) {
                            setInputValue(age.toString());
                            setInputError(false);
                          }
                        }}
                      />

                      <TouchableOpacity style={styles.counterButton} onPress={handleIncrement}>
                        <ThemedText style={styles.counterText}>{'>'}</ThemedText>
                      </TouchableOpacity>
                    </View>

                    {inputError && (
                      <ThemedText style={styles.errorText}>
                        Please enter numbers only (18-999)
                      </ThemedText>
                    )}
                  </View>
                </View>
              </View>

              {/* =============== WEIGHT CONTAINER =============== */}
              <View style={styles.weightContainer}>
                <View style={styles.leftColumn}>
                  <View style={styles.topLeft}>
                    <ThemedText style={styles.ageTitle}>Weight</ThemedText>
                  </View>
                  <View style={styles.bottomLeft}>
                    <ThemedText style={styles.ageSubtitle}>
                      Weight affects nutrient needs by influencing metabolism and abssadsaaadsorption.
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.formContainer}>
                    <TextInput
                      style={styles.weightInput}
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={weightValue}
                      onChangeText={setWeightValue}
                    />

                    <View style={styles.switchRow}>
                      <ThemedText style={styles.switchLabel}>kg</ThemedText>
                      <Switch
                        trackColor={{ false: '#e0e0e0', true: '#e0e0e0' }}
                        thumbColor={'#9AB106'}
                        style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
                        value={!isKg}
                        onValueChange={toggleWeightUnit}
                      />
                      <ThemedText style={styles.switchLabel}>lb</ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              {/* =============== HEIGHT CONTAINER =============== */}
              <View style={styles.heightContainer}>
                <View style={styles.leftColumn}>
                  <View style={styles.topLeft}>
                    <ThemedText style={styles.ageTitle}>Height</ThemedText>
                  </View>
                  <View style={styles.bottomLeft}>
                    <ThemedText style={styles.ageSubtitle}>
                      Height affects nutrient needs, growth, and overall development requirements.
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.formContainer}>
                    <TextInput
                      style={styles.weightInput}
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={heightValue}
                      onChangeText={setHeightValue}
                    />

                    <View style={styles.switchRow}>
                      <ThemedText style={styles.switchLabel}>ft</ThemedText>
                      <Switch
                        trackColor={{ false: '#e0e0e0', true: '#e0e0e0' }}
                        thumbColor={'#9AB106'}
                        style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
                        value={!isFt}
                        onValueChange={toggleHeightUnit}
                      />
                      <ThemedText style={styles.switchLabel}>cm</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      
      {/* Floating check button outside the KeyboardAvoidingView */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <ThemedText style={styles.checkMark}>✓</ThemedText>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: "flex-start"
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselDetailBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flex: 1,
    justifyContent: 'center',
  },
  carouselText: {
    fontSize: 12,
    lineHeight: 22,
    color: '#333',
    textAlign: 'left',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  ageContainer: {
    marginTop: 20,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 100,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  weightContainer: {
    marginTop: 20,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 100,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  heightContainer: {
    marginTop: 20,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 100,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  topLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#385802',
    textAlign: 'left',
  },
  ageSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    color: '#666',
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterButton: {
    paddingHorizontal: 6,
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ageInput: {
    height: 36,
    width: 60,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#eaeaea',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff0f0',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#ff4444',
  },
  weightInput: {
    height: 36,
    width: 60,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#eaeaea',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  switchLabel: {
    marginHorizontal: 0,
    fontSize: 14,
    color: '#333',
  },
  checkButton: {
    position: 'absolute',
    bottom: 10,
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
    color: '#9AB106',
    fontWeight: 'bold',
  },
  profileBox: {
    marginTop: 15,
    marginLeft: 10,
    width: 150,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  profileBoxText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  profileText: {
    fontSize: 12,
    color: '#9AB206',
  },
});
