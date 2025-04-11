import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  DimensionValue
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import PieChart from 'react-native-pie-chart';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';

const toProgressWidth = (value: number) => `${Math.min(value, 100)}%` as DimensionValue;
const toPercentageText = (value: number) => `${value}%`;
const formatValue = (value: number, unit: string = 'g') => `${value} ${unit}`;

type Page6ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-6'>;

interface NutritionData {
  progress: {
    carbohydrate: { user: number; avg: number };
    sodium: { user: number; avg: number };
    protein: { user: number; avg: number };
  };
  values: {
    carbohydrate: { user: number; avg: number };
    sodium: { user: number; avg: number };
    protein: { user: number; avg: number };
  };
  intake: {
    breakdown: { protein: number; carbohydrate: number; sodium: number };
    total: number;
  };
  avg: {
    breakdown: { protein: number; carbohydrate: number; sodium: number };
    total: number;
  };
}

export default function Page6() {
  const [nutritionData] = useState<NutritionData>({
    progress: {
      carbohydrate: { user: 88, avg: 50 },
      sodium: { user: 33, avg: 50 },
      protein: { user: 45, avg: 50 },
    },
    values: {
      carbohydrate: { user: 53, avg: 49 },
      sodium: { user: 15, avg: 11 },
      protein: { user: 180, avg: 147 }, 
    },
    intake: { 
      breakdown: { carbohydrate: 94, sodium: 2, protein: 4 },
      total: 93.33
    },
    avg: { 
      breakdown: { carbohydrate: 77, sodium: 7, protein: 16 },
      total: 402
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
            {/* Legends - Now properly spaced */}
            <View style={styles.legendsContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSquare, styles.userLegend]} />
                <Text style={styles.legendText}>User input</Text>
              </View>
              <View style={[styles.legendItem, styles.legendItemSpacing]}>
                <View style={[styles.legendSquare, styles.avgLegend]} />
                <Text style={styles.legendText}>Average intake</Text>
              </View>
            </View>

            {/* Carbohydrate Row (was Sugar) */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Carbs</Text>
                <Image source={require('@/assets/images/Carbohydrate Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.carbohydrate.user) }]} />
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.carbohydrate.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.carbohydrate.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.carbohydrate.avg)}</Text>
              </View>
            </View>

            {/* Sodium Row */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Sodium</Text>
                <Image source={require('@/assets/images/Sodium Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.sodium.user) }]} />
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.sodium.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.sodium.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.sodium.avg)}</Text>
              </View>
            </View>

            {/* Protein Row (was Calories) */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabel}>
                <Text style={styles.nutrientText}>Protein</Text>
                <Image source={require('@/assets/images/Protein Icon.png')} style={styles.icon} />
              </View>
              <View style={styles.progressBars}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.userProgress, { width: toProgressWidth(nutritionData.progress.protein.user) }]} />
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, styles.avgProgress, { width: toProgressWidth(nutritionData.progress.protein.avg) }]} />
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.userValue}>{formatValue(nutritionData.values.protein.user)}</Text>
                <Text style={styles.avgValue}>{formatValue(nutritionData.values.protein.avg)}</Text>
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
                      { value: nutritionData.intake.breakdown.protein, color: '#000000' },
                      { value: nutritionData.intake.breakdown.carbohydrate, color: '#7ca844' },
                      { value: nutritionData.intake.breakdown.sodium, color: '#c0b4b4' },
                    ]}
                    cover={0.55}
                  />
                </View>
                <View style={styles.legendWrapper}>
                  <Text style={styles.chartTitle}>User Intake</Text>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#7ca844' }]} />
                    <Text style={styles.legendLabel}>Carbohydrate ({toPercentageText(nutritionData.intake.breakdown.carbohydrate)})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#c0b4b4' }]} />
                    <Text style={styles.legendLabel}>Sodium ({toPercentageText(nutritionData.intake.breakdown.sodium)})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#000000' }]} />
                    <Text style={styles.legendLabel}>Protein ({toPercentageText(nutritionData.intake.breakdown.protein)})</Text>
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
                      { value: nutritionData.avg.breakdown.protein, color: '#000000' },
                      { value: nutritionData.avg.breakdown.carbohydrate, color: '#7ca844' },
                      { value: nutritionData.avg.breakdown.sodium, color: '#c0b4b4' },
                    ]}
                    cover={0.55}
                  />
                </View>
                <View style={styles.legendWrapper}>
                  <Text style={styles.chartTitle}>Average Intake</Text>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#7ca844' }]} />
                    <Text style={styles.legendLabel}>Carbohydrate ({toPercentageText(nutritionData.avg.breakdown.carbohydrate)})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#c0b4b4' }]} />
                    <Text style={styles.legendLabel}>Sodium ({toPercentageText(nutritionData.avg.breakdown.sodium)})</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.colorCircle, { backgroundColor: '#000000' }]} />
                    <Text style={styles.legendLabel}>Protein ({toPercentageText(nutritionData.avg.breakdown.protein)})</Text>
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
  legendsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendItemSpacing: {
    marginLeft: 24,
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
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
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
    color: '#333',
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  progressBars: {
    flex: 3.5,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    marginVertical: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  userProgress: {
    backgroundColor: 'black',
  },
  avgProgress: {
    backgroundColor: '#9AB106',
  },
  valueContainer: {
    flex: 0.80,
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
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  legendLabel: {
    fontSize: 12,
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
