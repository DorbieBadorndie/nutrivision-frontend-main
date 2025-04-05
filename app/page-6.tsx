import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Dimensions, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import PieChart from 'react-native-pie-chart';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';

const toProgressWidth = (value: number) => `${Math.min(value, 100)}%`;
const toPercentageText = (value: number) => `${value}%`;
const formatValue = (value: number, unit: string = 'g') => `${value} ${unit}`;

type Page6ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-6'>;

interface NutritionData {
  progress: {
    sugar: { user: number; avg: number };
    sodium: { user: number; avg: number };
    calories: { user: number; avg: number };
  };
  values: {
    sugar: { user: number; avg: number };
    sodium: { user: number; avg: number };
    calories: { user: number; avg: number };
  };
  intake: {
    breakdown: { calories: number; sugar: number; sodium: number };
    total: number;
  };
  avg: {
    breakdown: { calories: number; sugar: number; sodium: number };
    total: number;
  };
}

export default function Page6() {
  const [nutritionData] = useState<NutritionData>({
    progress: {
      sugar: { user: 88, avg: 50 },
      sodium: { user: 33, avg: 50 },
      calories: { user: 45, avg: 50 },
    },
    values: {
      sugar: { user: 53, avg: 49 },
      sodium: { user: 15, avg: 11 },
      calories: { user: 180, avg: 147 }, 
    },
    intake: { 
      breakdown: { calories: 22, sugar: 45, sodium: 22 },
      total: 209
    },
    avg: { 
      breakdown: { calories: 22, sugar: 45, sodium: 11 },
      total: 210
    },
  });

  const navigation = useNavigation<Page6ScreenNavigationProp>();

  const handleCheck = () => {
    navigation.navigate('page-2');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/NutriVision.png')}
            style={styles.logo}
            accessibilityRole="image"
            accessibilityLabel="NutriVision logo"
          />
        </View>

        <ThemedView style={styles.contentContainer}>
          {/* Progress Bars Section */}
          <View style={styles.progressContainer}>
            <View style={styles.legendsRow}>
              <View style={styles.legendProgress}>
                <View style={[styles.legendSquare, styles.userLegend]} />
                <Text style={styles.legendText}>User input</Text>
                <View style={[styles.legendSquare, styles.avgLegend]} />
                <Text style={styles.legendText}>Average intake</Text>
              </View>
            </View>

            {/* Sugar Row */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Sugar</Text>
                <Image source={require('@/assets/images/Sugar Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.sugar.user) }]} />
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.sugar.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.sugar.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.sugar.avg)}</Text>
              </View>
            </View>

            {/* Sodium Row */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Sodium</Text>
                <Image source={require('@/assets/images/Sodium Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.sodium.user) }]} />
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.sodium.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.sodium.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.sodium.avg)}</Text>
              </View>
            </View>

            {/* Calories Row */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Calories</Text>
                <Image source={require('@/assets/images/Cholesterol Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.calories.user) }]} />
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.calories.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.calories.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.calories.avg)}</Text>
              </View>
            </View>
          </View>

          {/* Donut Charts Section */}
          <View style={styles.chartsContainer}>
            {/* User Intake Donut Chart */}
            <View style={styles.chartBox}>
              <View style={styles.chartRow}>
                <View style={styles.chartWrapper}>
                  <PieChart
                    widthAndHeight={150}
                    series={[
                      { value: nutritionData.intake.breakdown.sodium, color: '#000000' },
                      { value: nutritionData.intake.breakdown.sugar, color: '#c0b4b4' },
                      { value: nutritionData.intake.breakdown.calories, color: '#7ca844' },
                    ]}
                    cover={0.55}
                  />
                </View>
                <View style={styles.legendWrapper}>
                  <Text style={styles.chartTitle}>USER INTAKE</Text>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#7ca844' }]} />
                    <Text style={styles.legendLabel}>Calories ({toPercentageText(nutritionData.intake.breakdown.calories)})</Text>
                  </View>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#c0b4b4' }]} />
                    <Text style={styles.legendLabel}>Sugar ({toPercentageText(nutritionData.intake.breakdown.sugar)})</Text>
                  </View>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#000000' }]} />
                    <Text style={styles.legendLabel}>Sodium ({toPercentageText(nutritionData.intake.breakdown.sodium)})</Text>
                  </View>
                  <View style={styles.totalBox}>
                    <Text style={styles.totalText}>
                      Total Nutrient{'\n'}Amount = {formatValue(nutritionData.intake.total)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Average Intake Donut Chart */}
            <View style={styles.chartBox}>
              <View style={styles.chartRow}>
                <View style={styles.chartWrapper}>
                  <PieChart
                    widthAndHeight={150}
                    series={[
                      { value: nutritionData.avg.breakdown.sodium, color: '#000000' },
                      { value: nutritionData.avg.breakdown.sugar, color: '#c0b4b4' },
                      { value: nutritionData.avg.breakdown.calories, color: '#7ca844' },
                    ]}
                    cover={0.55}
                  />
                </View>
                <View style={styles.legendWrapper}>
                  <Text style={styles.chartTitle}>AVERAGE INTAKE</Text>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#7ca844' }]} />
                    <Text style={styles.legendLabel}>Calories ({toPercentageText(nutritionData.avg.breakdown.calories)})</Text>
                  </View>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#c0b4b4' }]} />
                    <Text style={styles.legendLabel}>Sugar ({toPercentageText(nutritionData.avg.breakdown.sugar)})</Text>
                  </View>
                  <View style={styles.legendPie}>
                    <View style={[styles.colorCircle, { backgroundColor: '#000000' }]} />
                    <Text style={styles.legendLabel}>Sodium ({toPercentageText(nutritionData.avg.breakdown.sodium)})</Text>
                  </View>
                  <View style={styles.totalBox}>
                    <Text style={styles.totalText}>
                      Total Nutrient{'\n'}Amount = {formatValue(nutritionData.avg.total)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>

      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <ThemedText style={styles.checkMark}>✓</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: "flex-start"
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  legendsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  legendPie: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  userLegend: {
    backgroundColor: 'black',
  },
  avgLegend: {
    backgroundColor: '#9AB106',
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientLabel: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  progressBars: {
    flex: 3,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '50%',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
  userProgress: {
    backgroundColor: 'black',
  },
  avgProgress: {
    backgroundColor: '#9AB106',
    top: '50%',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  avgValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9AB106',
  },
  chartsContainer: {
    gap: 16,
  },
  chartBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  chartRow: {
    flexDirection: 'row',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: '#333',
  },
  totalBox: {
    backgroundColor: '#f8e4e4',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  totalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  checkButton: {
    position: 'absolute',
    bottom: 20,
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
});